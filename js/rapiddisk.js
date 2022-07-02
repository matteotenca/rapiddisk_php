/* jshint esversion: 6 */
let frequencyId = null;
// window.onload = function() {
//     'use strict';
//     getdevices();
//     setTimeout(getdata, 600);
// };

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
        frequencyId = setInterval(getdata, freq * 1000);
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
        // document.getElementById(divId).style.height = "0px";
    }

    for (let i = 0; i < data.length; i++) {
        let chartData = data[i];
        let divId = "chartContainer" + i;
        // if (document.getElementById(divId).style.display === "0px") {
        //     document.getElementById(divId).style.height = "400px";
        // }
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
    selectList.innerHTML = "";
    for (let i = 0; i < devices_data.length; i++) {
        option = document.createElement("option");
        dev_name = devices_data[i]["device"];
        option.value = dev_name;
        option.text = dev_name;
        selectList.appendChild(option);
    }
}

function getdevices() {
    'use strict';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let json = JSON.parse(this.responseText);
            update_devices(json);
        }
    };
    xmlhttp.open("POST", "http://www.ubuserver.mylocal/update_stats.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("devices=");
}

function getdata() {
    'use strict';
    let xmlhttp = new XMLHttpRequest();
    let dev = document.getElementById("devicesList").value;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let json = JSON.parse(this.responseText);
            update_graph(json);
        }
    };
    xmlhttp.open("POST", "http://www.ubuserver.mylocal/update_stats.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`stats=&dev=${dev}`);
}
