/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/login"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=custom"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=form"], "isController": false}, {"data": [1.0, 500, 1500, "\/fetchDL"], "isController": false}, {"data": [1.0, 500, 1500, "\/ed\/status"], "isController": false}, {"data": [1.0, 500, 1500, "\/fetchTimezones"], "isController": false}, {"data": [1.0, 500, 1500, "\/u\/dental\/member\/affiliatedOrgs"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=feedback"], "isController": false}, {"data": [1.0, 500, 1500, "\/ipc"], "isController": false}, {"data": [1.0, 500, 1500, "\/da\/ed\/status"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=calibration"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=data"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=aliReport"], "isController": false}, {"data": [1.0, 500, 1500, "\/u\/dental\/eform\/all"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=aliUpgrade"], "isController": false}, {"data": [1.0, 500, 1500, "\/u\/dental\/fetchlab"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=dot"], "isController": false}, {"data": [1.0, 500, 1500, "\/sm\/power"], "isController": false}, {"data": [1.0, 500, 1500, "\/status"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=install"], "isController": false}, {"data": [1.0, 500, 1500, "\/ed\/active\/down"], "isController": false}, {"data": [1.0, 500, 1500, "\/v2\/u\/edu\/list"], "isController": false}, {"data": [1.0, 500, 1500, "\/dtta?type=dentalScan"], "isController": false}, {"data": [1.0, 500, 1500, "\/fetchCountries"], "isController": false}, {"data": [1.0, 500, 1500, "\/u\/dental\/ufactory\/list"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 0, 0.0, 44.153846153846146, 5, 425, 19.0, 85.20000000000002, 311.94999999999953, 425.0, 19.96927803379416, 202.854982718894, 20.47106014784946], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/login", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 61.431525735294116, 0.9443933823529412], "isController": false}, {"data": ["\/dtta?type=custom", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 14.990234375, 86.865234375], "isController": false}, {"data": ["\/dtta?type=form", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 19.986979166666668, 108.65885416666667], "isController": false}, {"data": ["\/fetchDL", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 7.665094339622642, 10.7421875], "isController": false}, {"data": ["\/ed\/status", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 65.75520833333333, 51.513671875], "isController": false}, {"data": ["\/fetchTimezones", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 586.5885416666667, 9.650735294117649], "isController": false}, {"data": ["\/u\/dental\/member\/affiliatedOrgs", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 153.24519230769232, 19.53125], "isController": false}, {"data": ["\/dtta?type=feedback", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 16.655815972222225, 96.35416666666667], "isController": false}, {"data": ["\/ipc", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 31.34765625, 48.14453125], "isController": false}, {"data": ["\/da\/ed\/status", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 23.525140224358974, 7.274138621794871], "isController": false}, {"data": ["\/dtta?type=calibration", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 17.635569852941174, 110.35156249999999], "isController": false}, {"data": ["\/dtta?type=data", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 18.73779296875, 105.04150390625], "isController": false}, {"data": ["\/dtta?type=aliReport", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 14.27641369047619, 78.17150297619047], "isController": false}, {"data": ["\/u\/dental\/eform\/all", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 92.85960477941175, 17.951516544117645], "isController": false}, {"data": ["\/dtta?type=aliUpgrade", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 17.635569852941174, 105.87086397058823], "isController": false}, {"data": ["\/u\/dental\/fetchlab", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 21.414620535714285, 50.083705357142854], "isController": false}, {"data": ["\/dtta?type=dot", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 18.73779296875, 106.50634765625], "isController": false}, {"data": ["\/sm\/power", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 36.1328125, 53.88849431818182], "isController": false}, {"data": ["\/status", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 39.6484375, 96.875], "isController": false}, {"data": ["\/dtta?type=install", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 19.986979166666668, 114.90885416666667], "isController": false}, {"data": ["\/ed\/active\/down", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 50.26041666666667, 41.536458333333336], "isController": false}, {"data": ["\/v2\/u\/edu\/list", 2, 0, 0.0, 40.0, 39, 41, 40.0, 41.0, 41.0, 41.0, 23.52941176470588, 709.9839154411765, 13.706341911764705], "isController": false}, {"data": ["\/dtta?type=dentalScan", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 6.378823138297872, 48.952792553191486], "isController": false}, {"data": ["\/fetchCountries", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 4020.4427083333335, 16.40625], "isController": false}, {"data": ["\/u\/dental\/ufactory\/list", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 117.62791053921569, 5.083869485294118], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
