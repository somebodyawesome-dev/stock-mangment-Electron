var fs = require("fs");
var path = require("path");

var rawData = fs.readFileSync(path.resolve(__dirname, "js/inventory.json"));
var inv = JSON.parse(rawData);

var keyBuyPrice = 0;
var keySellPrice = 0;

var keyShellBuyPrice = 0;
var keyShellSellPrice = 0;

var keyTranBuyPrice = 0;
var keyTranSellPrice = 0;

var battBuyPrice = 0;
var battSellPrice = 0;

inv.items.forEach((e) => {
  if (e.type == "Keys") {
    keyBuyPrice += e.quantity * e.buyPrice;
    keySellPrice += e.quantity * e.sellPrice;
  } else if (e.type == "Key shells") {
    keyShellBuyPrice += e.quantity * e.buyPrice;
    keyShellSellPrice += e.quantity * e.sellPrice;
  } else if (e.type == "Key transponders") {
    keyTranBuyPrice += e.quantity * e.buyPrice;
    keyTranSellPrice += e.quantity * e.sellPrice;
  } else if (e.type == "Batteries") {
    battBuyPrice = e.quantity * e.buyPrice;
    battSellPrice = e.quantity * e.sellPrice;
  }
});

var keysBuy = document.getElementById("keysBuy");
var keysSell = document.getElementById("keysSell");
var shellBuy = document.getElementById("shellBuy");
var shellSell = document.getElementById("shellSell");
var transBuy = document.getElementById("transBuy");
var transSell = document.getElementById("transSell");
var battBuy = document.getElementById("battBuy");
var battSell = document.getElementById("battSell");
var totalBuy = document.getElementById("totalBuy");
var totalSell = document.getElementById("totalSell");

keysBuy.innerHTML = keyBuyPrice / 1000 + "DT";
keysSell.innerHTML = keySellPrice / 1000 + "DT";
shellBuy.innerHTML = keyShellBuyPrice / 1000 + "DT";
shellSell.innerHTML = keyShellSellPrice / 1000 + "DT";
transBuy.innerHTML = keyTranBuyPrice / 1000 + "DT";
transSell.innerHTML = keyTranSellPrice / 1000 + "DT";
battBuy.innerHTML = battBuyPrice / 1000 + "DT";
battSell.innerHTML = battSellPrice / 1000 + "DT";
totalBuy.innerHTML =
  (keyBuyPrice + keyShellBuyPrice + keyTranBuyPrice + battBuyPrice) / 1000 +
  "DT";
totalSell.innerHTML =
  (keySellPrice + keyShellSellPrice + keyTranSellPrice + battSellPrice) / 1000 +
  "DT";
