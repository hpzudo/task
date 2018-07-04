/**
 * eurojackpot_results.html main js
 * 
 * Calls Lottoland eurojackpot API and draw the results into a table.
 */
$(document).ready(function(){

    /**************************
    *       FUNCTIONS        **
    ***************************/

    /**
    * Calls EuroJackpot API to obtain winning results.
    * @returns API json data
    */    
    let  getEuroJackpotResults = () => {
1
        const deferred = $.Deferred();

        $.ajax({
            dataType: 'jsonp',
            type	: 'GET',
            url		: 'https://www.lottoland.com/api/drawings/euroJackpot'
        }).done(
            data => deferred.resolve(data)
        ).fail(
            (err, status) => deferred.fail(status)
        );

        return deferred.promise();
    }

    /**
     * Formats raw euroJackpot API data 
     * @param {raw data from euroJackpot API} data 
     * @returns formatted object:   numbers:[...], 
     *                              euroNumbers:[...], 
     *                              rank1: {"tier": ..., "match": ..., "winners": ..., "amount": ...}, 
     *                              ..., 
     *                              rankN: {...}
     */
    let formatEuroJackpotLastResults = (data) => {
        
        const numbers = data.numbers;
        const euroNumbers = data.euroNumbers;
        const results = data.odds;  
        let formattedResult = [];     
        formattedResult["numbers"] = data.numbers;
        formattedResult["euroNumbers"] =  data.euroNumbers;
        formattedResult["date"] = formattedDate(data.date);
        formattedResult["ranks"] = [];

        $.each(results, function(index, result) {
            const prizeWithCommaAndDec = numberWithCommasAndDecimals(result.prize.toString());
            const winnersWithComma = result.winners.toString().length <= 2 ? `${result.winners.toString()}x` : numberWithCommasAndDecimals(`${result.winners.toString()}00`).replace('.00', 'x');
            let tier = '';
            let match = '';
            switch(index){
                case "rank1":
                    tier = 'I';
                    match = `5 Numbers + 
                             2 Euronumbers`;
                    break;
                case "rank2":
                    tier = 'II';
                    match = `5 Numbers + 
                             1 Euronumbers`;
                    break;
                case "rank3":
                    tier = 'III';
                    match = `5 Numbers + 
                             0 Euronumbers`;
                    break;
                case "rank4":
                    tier = 'IV';
                    match = `4 Numbers + 
                             2 Euronumbers`;
                    break;
                case "rank5":
                    tier = 'V';
                    match = `4 Numbers + 
                             1 Euronumbers`;
                    break;
                case "rank6":
                    tier = 'VI';
                    match = `4 Numbers + 
                             0 Euronumbers`;
                    break;
                case "rank7":
                    tier = 'VII';
                    match = `3 Numbers + 
                             2 Euronumbers`;
                    break;
                case "rank8":
                    tier = 'VIII';
                    match = `2 Numbers + 
                             2 Euronumbers`;
                    break;
                case "rank9":
                    tier = 'IX';
                    match = `3 Numbers + 
                             1 Euronumbers`;
                    break;
                case "rank10":
                    tier = 'X';
                    match = `3 Numbers + 
                             0 Euronumbers`;
                    break;
                case "rank11":
                    tier = 'XI';
                    match = `1 Numbers + 
                             2 Euronumbers`;
                    break;
                case "rank12":
                    tier = 'XII';
                    match = `2 Numbers + 
                             1 Euronumbers`;
                    break;
                default:
                    tier = '0';
                    break;
            }
            if(tier !== '0'){
                formattedResult['ranks'][index] = {
                    "tier"          :   tier,
                    "match"         :   match,
                    "winners"       :   winnersWithComma,
                    "amount"        :   `€${prizeWithCommaAndDec}`
                };

            }
        }); 
        

        return formattedResult;
    }
  
    /**
     * 
     * @param {raw number for example 123345} num 
     * @return formatted number with commands and decimals (for example 1,233.45)
     */
    let numberWithCommasAndDecimals = (num) => {
            const numLength = num.length;
            const commaNum = numLength < 3 ? 0 : num.substr(0, numLength - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const decNum = numLength < 2 ? `${num}0` : (numLength < 3) ? num : num.substr(numLength - 2, numLength);
            return `${commaNum}.${decNum}`;
    }

    /** Draws Body Table from EuroJackpot Results
     * @param {table data} tableData
     */
    let drawEuroJackpotResults = (euroJackpotLastResults) => {

        let tableBodyHtml = '';
        let winnerResultsHtml = '';
        const euroJackpotNums = euroJackpotLastResults.numbers;
        const euroJackpotEuroNums = euroJackpotLastResults.euroNumbers;
        const euroJackpotRanks = euroJackpotLastResults.ranks;
        const euroJackpotResultsDate = euroJackpotLastResults.date;

        // Title results draw
        $('#results-title').html(`<span class="euroJackpotCo">EuroJackpot</span> Results for ${euroJackpotResultsDate}`);

        // Winner results numbers
        for (const key in euroJackpotNums) { 
            winnerResultsHtml = `${winnerResultsHtml}
            <li class="l-lottery-number">
                ${euroJackpotNums[key]}
            </li>`;
        }
        for (const key in euroJackpotEuroNums) { 
            winnerResultsHtml = `${winnerResultsHtml}
            <li class="l-lottery-number extra extra">
                ${euroJackpotEuroNums[key]}
            </li>`;
        }
        $('#results-numbers > ul').html(winnerResultsHtml);

        // Table body draw
        for (const key in euroJackpotRanks) {
            tableBodyHtml = `${tableBodyHtml}
            <tr>
                <td>${euroJackpotRanks[key].tier}</td>
                <td>${euroJackpotRanks[key].match}</td>
                <td>${euroJackpotRanks[key].winners}</td>
                <td>${euroJackpotRanks[key].amount}</td>
            </tr>`;
        }
        $('#eurojackpot-results-table tbody').html(tableBodyHtml);
        
    }

    /**
     * Checks if data is JSON
     * @param {JSON} str 
     */
    let IsJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {object: {"day": d "month": m "year": y, ...}} date 
     * @return example: if day = 29, month = 6, year = 2018, returns: Friday 29 Jun 2018
     */
    let formattedDate = (date) => {
        const dateMonth = date.month;
        const dateDay = date.day;
        const dateYear = date.year;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = {  
            '1' : 'Jan', 
            '2' : 'Feb', 
            '3' : 'Mar', 
            '4' : 'Apr', 
            '5' : 'May', 
            '6' : 'Jun', 
            '7' : 'Jul', 
            '8' : 'Aug', 
            '9' : 'Sep', 
            '10': 'Oct',
            '11': 'Nov', 
            '12': 'Dec'
        };
        const d = new Date(`${dateMonth}-${dateDay}-${dateYear}`);
        const dayName = days[d.getDay()];
        const monthName = months[dateMonth];

        return `${dayName} ${dateDay} ${monthName} ${dateYear}`;
    }


    /**************************
    *         CALLS          **
    ***************************/

   getEuroJackpotResults ()
        .done(
            data => {
                if(IsJsonString && 'last' in data){
                    const euroJackpotLastResults = formatEuroJackpotLastResults(data.last);
                    drawEuroJackpotResults(euroJackpotLastResults);
                }
                else{
                    console.log('field "last" does not exist on the callback API data');
                }
            }
        ) 
        .fail(
            data => {
                console.log(`Error when calling getEuroJackpotResults(): ${data}`);
            }
        );


});