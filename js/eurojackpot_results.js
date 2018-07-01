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
    let getEuroJackpotResults = () => {
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
     * @returns formatted object: {"tier": ..., "match": ..., "winners": ..., "amount": ...}
     */
    let formatEuroJackpotLastResults = (data) => {
        
        const numbers = data.numbers;
        const euroNumbers = data.euroNumbers;
        const results = data.odds;
        let formattedResult = {};

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
                formattedResult[index] = {
                    "tier"      :   tier,
                    "match"     :   match,
                    "winners"   :   winnersWithComma,
                    "amount"    :   `€${prizeWithCommaAndDec}`
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


    /**************************
    *         CALLS          **
    ***************************/


    getEuroJackpotResults()
        .done(
            data => {
                if('last' in data){
                    const euroJackpotLastResults = formatEuroJackpotLastResults(data.last);
                    let tableBodyHtml = '';
                    for (const key in euroJackpotLastResults) {
                        tableBodyHtml = `${tableBodyHtml}
                                            <tr>
                                                <td>${euroJackpotLastResults[key].tier}</td>
                                                <td>${euroJackpotLastResults[key].match}</td>
                                                <td>${euroJackpotLastResults[key].winners}</td>
                                                <td>${euroJackpotLastResults[key].amount}</td>
                                            </tr>`;
                    }

                    $('#eurojackpot-results-table tbody').html(tableBodyHtml);
                }
                else{
                    console.log('field "last" does not exist on the callback API data');
                }
            }
        ) 
        .fail(
            data => {
                let test2 = "hola2";
            }
        );


});