'use strict';

/**
 * eurojackpot_results.html main js
 * 
 * Calls Lottoland eurojackpot API and draw the results into a table.
 */
$(document).ready(function () {

    /**************************
    *       FUNCTIONS        **
    ***************************/

    /**
    * Calls EuroJackpot API to obtain winning results.
    * @returns API json data
    */
    var getEuroJackpotResults = function getEuroJackpotResults() {
        1;
        var deferred = $.Deferred();

        $.ajax({
            dataType: 'jsonp',
            type: 'GET',
            url: 'https://www.lottoland.com/api/drawings/euroJackpot'
        }).done(function (data) {
            return deferred.resolve(data);
        }).fail(function (err, status) {
            return deferred.fail(status);
        });

        return deferred.promise();
    };

    /**
     * Formats raw euroJackpot API data 
     * @param {raw data from euroJackpot API} data 
     * @returns formatted object:   numbers:[...], 
     *                              euroNumbers:[...], 
     *                              rank1: {"tier": ..., "match": ..., "winners": ..., "amount": ...}, 
     *                              ..., 
     *                              rankN: {...}
     */
    var formatEuroJackpotLastResults = function formatEuroJackpotLastResults(data) {

        var numbers = data.numbers;
        var euroNumbers = data.euroNumbers;
        var results = data.odds;
        var formattedResult = [];
        formattedResult["numbers"] = data.numbers;
        formattedResult["euroNumbers"] = data.euroNumbers;
        formattedResult["date"] = formattedDate(data.date);
        formattedResult["ranks"] = [];

        $.each(results, function (index, result) {
            var prizeWithCommaAndDec = numberWithCommasAndDecimals(result.prize.toString());
            var winnersWithComma = result.winners.toString().length <= 2 ? result.winners.toString() + 'x' : numberWithCommasAndDecimals(result.winners.toString() + '00').replace('.00', 'x');
            var tier = '';
            var match = '';
            switch (index) {
                case "rank1":
                    tier = 'I';
                    match = '5 Numbers + \n                             2 Euronumbers';
                    break;
                case "rank2":
                    tier = 'II';
                    match = '5 Numbers + \n                             1 Euronumbers';
                    break;
                case "rank3":
                    tier = 'III';
                    match = '5 Numbers + \n                             0 Euronumbers';
                    break;
                case "rank4":
                    tier = 'IV';
                    match = '4 Numbers + \n                             2 Euronumbers';
                    break;
                case "rank5":
                    tier = 'V';
                    match = '4 Numbers + \n                             1 Euronumbers';
                    break;
                case "rank6":
                    tier = 'VI';
                    match = '4 Numbers + \n                             0 Euronumbers';
                    break;
                case "rank7":
                    tier = 'VII';
                    match = '3 Numbers + \n                             2 Euronumbers';
                    break;
                case "rank8":
                    tier = 'VIII';
                    match = '2 Numbers + \n                             2 Euronumbers';
                    break;
                case "rank9":
                    tier = 'IX';
                    match = '3 Numbers + \n                             1 Euronumbers';
                    break;
                case "rank10":
                    tier = 'X';
                    match = '3 Numbers + \n                             0 Euronumbers';
                    break;
                case "rank11":
                    tier = 'XI';
                    match = '1 Numbers + \n                             2 Euronumbers';
                    break;
                case "rank12":
                    tier = 'XII';
                    match = '2 Numbers + \n                             1 Euronumbers';
                    break;
                default:
                    tier = '0';
                    break;
            }
            if (tier !== '0') {
                formattedResult['ranks'][index] = {
                    "tier": tier,
                    "match": match,
                    "winners": winnersWithComma,
                    "amount": '\u20AC' + prizeWithCommaAndDec
                };
            }
        });

        return formattedResult;
    };

    /**
     * 
     * @param {raw number for example 123345} num 
     * @return formatted number with commands and decimals (for example 1,233.45)
     */
    var numberWithCommasAndDecimals = function numberWithCommasAndDecimals(num) {
        var numLength = num.length;
        var commaNum = numLength < 3 ? 0 : num.substr(0, numLength - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var decNum = numLength < 2 ? num + '0' : numLength < 3 ? num : num.substr(numLength - 2, numLength);
        return commaNum + '.' + decNum;
    };

    /** Draws Body Table from EuroJackpot Results
     * @param {table data} tableData
     */
    var drawEuroJackpotResults = function drawEuroJackpotResults(euroJackpotLastResults) {

        var tableBodyHtml = '';
        var winnerResultsHtml = '';
        var euroJackpotNums = euroJackpotLastResults.numbers;
        var euroJackpotEuroNums = euroJackpotLastResults.euroNumbers;
        var euroJackpotRanks = euroJackpotLastResults.ranks;
        var euroJackpotResultsDate = euroJackpotLastResults.date;

        // Title results draw
        $('#results-title').html('<span class="euroJackpotCo">EuroJackpot</span> Results for ' + euroJackpotResultsDate);

        // Winner results numbers
        for (var key in euroJackpotNums) {
            winnerResultsHtml = winnerResultsHtml + '\n            <li class="l-lottery-number">\n                ' + euroJackpotNums[key] + '\n            </li>';
        }
        for (var _key in euroJackpotEuroNums) {
            winnerResultsHtml = winnerResultsHtml + '\n            <li class="l-lottery-number extra extra">\n                ' + euroJackpotEuroNums[_key] + '\n            </li>';
        }
        $('#results-numbers > ul').html(winnerResultsHtml);

        // Table body draw
        for (var _key2 in euroJackpotRanks) {
            tableBodyHtml = tableBodyHtml + '\n            <tr>\n                <td>' + euroJackpotRanks[_key2].tier + '</td>\n                <td>' + euroJackpotRanks[_key2].match + '</td>\n                <td>' + euroJackpotRanks[_key2].winners + '</td>\n                <td>' + euroJackpotRanks[_key2].amount + '</td>\n            </tr>';
        }
        $('#eurojackpot-results-table tbody').html(tableBodyHtml);
    };

    /**
     * Checks if data is JSON
     * @param {JSON} str 
     */
    var IsJsonString = function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * 
     * @param {object: {"day": d "month": m "year": y, ...}} date 
     * @return example: if day = 29, month = 6, year = 2018, returns: Friday 29 Jun 2018
     */
    var formattedDate = function formattedDate(date) {
        var dateMonth = date.month;
        var dateDay = date.day;
        var dateYear = date.year;
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = {
            '1': 'Jan',
            '2': 'Feb',
            '3': 'Mar',
            '4': 'Apr',
            '5': 'May',
            '6': 'Jun',
            '7': 'Jul',
            '8': 'Aug',
            '9': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        };
        var d = new Date(dateMonth + '-' + dateDay + '-' + dateYear);
        var dayName = days[d.getDay()];
        var monthName = months[dateMonth];

        return dayName + ' ' + dateDay + ' ' + monthName + ' ' + dateYear;
    };

    /**************************
    *         CALLS          **
    ***************************/

    getEuroJackpotResults().done(function (data) {
        if (IsJsonString && 'last' in data) {
            var euroJackpotLastResults = formatEuroJackpotLastResults(data.last);
            drawEuroJackpotResults(euroJackpotLastResults);
        } else {
            console.log('field "last" does not exist on the callback API data');
        }
    }).fail(function (data) {
        console.log('Error when calling (): ' + data);
    });
});