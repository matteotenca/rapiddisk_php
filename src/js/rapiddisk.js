/* global CanvasJS */
/* jshint esversion: 6 */

let frequencyId = null;
let host = "http://127.0.0.1:9229";
let getinfoId;
const VERSION = "v0.0.1";

window.onload = function() {
    'use strict';
    getinfo();
    getinfoId = setInterval(getinfo, 3000);
};

function update_tabs(data) {
    'use strict';
    let ramdisks = data["volumes"][0]["rapiddisk"];
    let mappings = data["volumes"][1]["rapiddisk_cache"];
    update_devices(mappings);
    let tbody = document.getElementById("table_ramdisks");
    tbody.innerHTML = "";
    let tr;
    let th0;
    let td1;
    let td2;
    let td3;
    let td4;
    let mb;
    for (let i = 0; i < ramdisks.length; i++) {
        tr = document.createElement("tr");
        th0 = document.createElement("th");
        td1 = document.createElement("td");
        td2 = document.createElement("td");
        td3 = document.createElement("td");
        th0.innerText = String(i);
        th0.scope = "row";
        td1.innerText = ramdisks[i]["device"];
        td2.innerText = ramdisks[i]["size"].toLocaleString();
        mb = parseFloat(ramdisks[i]["size"]) / 1024 / 1024;
        td3.innerText = mb.toLocaleString();
        tr.appendChild(th0);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
    }
    tbody = document.getElementById("table_mappings");
    tbody.innerHTML = "";
    for (let i = 0; i < mappings.length; i++) {
        tr = document.createElement("tr");
        th0 = document.createElement("th");
        td1 = document.createElement("td");
        td2 = document.createElement("td");
        td3 = document.createElement("td");
        td4 = document.createElement("td");
        th0.innerText = String(i);
        th0.scope = "row";
        td1.innerText = mappings[i]["device"];
        td2.innerText = mappings[i]["cache"];
        td3.innerText = mappings[i]["source"];
        td4.innerText = mappings[i]["mode"];
        tr.appendChild(th0);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
    }
}

function stop() {
    'use strict';
    document.getElementById('updateTime').value = 0;
    change_frequency();
}

function change_frequency() {
    'use strict';
    let freq = parseInt(document.getElementById("updateTime").value);
    if (freq >= 3) {
        if (frequencyId !== null) {
            clearInterval(frequencyId);
        }
        frequencyId = setInterval(get_graph_data, freq * 1000);
    } else if (freq === 0) {
        if (frequencyId !== null) {
            clearInterval(frequencyId);
            frequencyId = null;
        }
    } else {
        document.getElementById("updateTime").value = "0";
    }
}

function update_graph(data) {
    'use strict';
    let dev = document.getElementById("devicesList").value;
    for (let i = 2; i < 4; i++) {
        let divId = "chartContainer" + i;
        document.getElementById(divId).innerHTML = "";
    }

    for (let i = 0; i < data.length; i++) {
        let chartData = data[i];
        let divId = "chartContainer" + i;
        let chart = new CanvasJS.Chart(divId, {
            animationEnabled: false,
            theme: "light3",
            axisX: {
                labelMaxWidth: 70,
                labelWrap: true
            },
            title: {
                text: `Device: ${dev}`,
                fontSize: 20,
                fontFamily: "arial"
            },
            data: [{
                type: "column",
                indexLabel: "{y}",
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
                indexLabelWrap: true,
                yValueFormatString: "#,##0.##",
                dataPoints: chartData
            }]
        });
        chart.render();
    }
}

function update_devices(devices_data) {
    'use strict';
    let selectList = document.getElementById("devicesList");
    let option;
    let dev_name;
    let selectLen = selectList.options.length;
    let devices_data_len = devices_data.length;
    let changed = false;

    let selectValues = [];
    let devicesValues = [];

    for (let q = 0; q < selectLen; q++) {
        selectValues.push(selectList[q].value);
    }
    for (let i = 0; i < devices_data_len; i++) {
        devicesValues.push(devices_data[i]["device"]);
    }

    for (let q = 0; q < selectLen; q++) {
        let currentVal = selectList[q].value;
        if (! devicesValues.includes(currentVal)) {
            selectList.removeChild(selectList[q]);
            let ind = selectValues.indexOf(currentVal);
            // selectValues = selectValues.filter(filter_callback);
            selectValues.splice(ind, 1);
            changed = true;
        }

    }

    for (let i = 0; i < devices_data_len; i++) {
        dev_name = devices_data[i]["device"];
        if (! selectValues.includes(devices_data[i]["device"])) {
            option = document.createElement("option");
            option.value = dev_name;
            option.text = dev_name;
            option.id = dev_name;
            selectList.appendChild(option);
            changed = true;
        }
    }

    if (changed) {
        setTimeout(get_graph_data, 500);
    }
}

function getinfo() {
    'use strict';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText.length > 0) {
                let json = JSON.parse(this.responseText);
                update_tabs(json);
            }
        }
    };
    xmlhttp.open("POST", host + "/update_stats.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("devices=all");
}

function get_graph_data() {
    'use strict';
    let xmlhttp = new XMLHttpRequest();
    let dev = document.getElementById("devicesList").value;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText.length > 0) {
                let json = JSON.parse(this.responseText);
                update_graph(json);
            }
        }
    };
    xmlhttp.open("POST", host + "/update_stats.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`stats=${dev}`);
}
