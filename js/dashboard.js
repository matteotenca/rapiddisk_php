/* jshint esversion: 6 */
let getinfoId;
let getdevicesId;
window.onload = function() {
    'use strict';
    getinfo();
    getdevices();
    getinfoId = setInterval(getinfo, 5000);
    // getdevicesId = setInterval(getdevices, 5000);
    // setTimeout(getdata, 600);
    // setTimeout(getdata, 600);
};

function getinfo() {
    'use strict';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let json = JSON.parse(this.responseText);
            update_tabs(json);
        }
    };
    xmlhttp.open("GET", "http://www.ubuserver.mylocal/get_info.php", true);
    xmlhttp.send();
}

function update_tabs(data) {
    'use strict';
    let ramdisks = data["volumes"][0]["rapiddisk"];
    let mappings = data["volumes"][1]["rapiddisk_cache"];

    // let ul = document.createElement("table");
    // ul.className = "table table-hover";
    // let thead = document.createElement("thead");
    // let thead_tr = document.createElement("tr");
    // thead
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