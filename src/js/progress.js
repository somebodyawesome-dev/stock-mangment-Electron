const fs = require("fs");
const readLine = require("readline");
const path = require("path");

let rawData = fs.readFileSync(path.resolve(__dirname, "js/inventory.json"));
var inv = JSON.parse(rawData);

var historyBox = document.getElementById("history-box");
var totalBuy = document.getElementById("totalBuy");
var totalSell = document.getElementById("totalSell");

initHistory();


function initHistory() {
  var buy = 0;
  var sell = 0;
  for (var i = 0; i < inv.transactions.length; i++) {
    var transaction = `
        <div class="transaction" onclick="displayDetails(${i})" >
        <div class="info-box">${inv.transactions[i].date}</div>
            <div class="info-box">${inv.transactions[i].buyPrice / 1000}DT</div>
            <div class="info-box">${
              inv.transactions[i].sellPrice / 1000
            }DT</div>
        </div>
        `;
    buy += inv.transactions[i].buyPrice;
    sell += inv.transactions[i].sellPrice;
    historyBox.innerHTML = transaction + historyBox.innerHTML;
  }
  historyBox.innerHTML =
    `
  <div class="transaction title" >
  <div class="info-box ">Sale Date</div>
      <div class="info-box ">Buy Price</div>
      <div class="info-box ">Sell Price</div>
  </div>
  ` + historyBox.innerHTML;
  totalBuy.innerHTML = buy / 1000 + "DT";
  totalSell.innerHTML = sell / 1000 + "DT";
}






function displayDetails(index) {
  document.getElementById('saleDetails').style.display='block'
  var itemsBox = document.getElementById("items-box");
  itemsBox.innerHTML = `
  <div class="itemSold">
            <div class="info-box title">name</div>
            <div class="info-box title">ref</div>
            <div class="info-box title">type</div>
            <div class="info-box title">quantity sold</div>
            <div class="info-box title">buy Price</div>
            <div class="info-box title">sell Price</div>
          </div>
  `;
  for (var i = 0; i < inv.transactions[index].itemsSolde.length; i++) {
    var item = `
    <div class="itemSold">
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].name}</div>
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].ref}</div>
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].type}</div>
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].quantitySold}</div>
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].buyPrice}</div>
            <div class="info-box ">${inv.transactions[index].itemsSolde[i].sellPrice}</div>
          </div>
          `;
          itemsBox.innerHTML+=item;
  }
}




var searchButt = document.getElementById("searchButton");
searchButt.onclick = () => {
  var buy = 0;
  var sell = 0;
  var fromDate = new Date(document.getElementById("fromDate").value);
  var toDate = new Date(document.getElementById("toDate").value);
  if (fromDate == "Invalid Date") fromDate = new Date(inv.transactions[0].date);
  if (toDate == "Invalid Date") toDate = new Date();

  var trans = [...document.getElementsByClassName("transaction")].reverse();

  for (var i = 0; i < inv.transactions.length; i++) {
    var transDate = new Date(inv.transactions[i].date);
    if (transDate >= fromDate && transDate <= toDate) {
      trans[i].style.display = "flex";
      buy += inv.transactions[i].buyPrice;
      sell += inv.transactions[i].sellPrice;
    } else trans[i].style.display = "none";
  }

  totalBuy.innerHTML = buy / 1000 + "DT";
  totalSell.innerHTML = sell / 1000 + "DT";
};


var closeButt=document.getElementById('closeButt');
closeButt.onclick = ()=>{
  document.getElementById('saleDetails').style.display='none';
}