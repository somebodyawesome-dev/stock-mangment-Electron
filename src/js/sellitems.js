var fs = require("fs");
var path = require("path");
const { dialog } = require("electron").remote;

var rawData = fs.readFileSync(path.resolve(__dirname, "js/inventory.json"));
var inv = JSON.parse(rawData);

var total = document.getElementById("totalprice");
var invBox = document.getElementById("inv-box");
var sellButton = document.getElementById("saveBtn");

var inputs = [];
var items = [];
InitInventory();

function InitInventory() {
  invBox.innerHTML = "";

  for (var i = 0; i < inv.items.length; i++) {
    var item = `
        <div class="item-box" id="${inv.items[i].ref}-${inv.items[i].name}">
        <p>${inv.items[i].ref}</p>
        <p>${inv.items[i].name}</p>
        <div class="btn-box">
            <button class="btn minusButt" targetInputIndex="${i}" onclick="minusItem(this)">-</button>
            <input type="text" value="0" id="input${i}" index="${i}" onchange="initInput(this)">
            <button class="btn plusButt" targetInputIndex="${i}" onclick="addItem(this)">+</button>
        </div>
        </div>
        `;
    invBox.innerHTML += item;
    inputs.push(document.getElementById("input" + i));
  }
}

function addItem(element) {
  var index = Number(element.getAttribute("targetInputIndex"));

  var targetinput = document.getElementById("input" + index);

  if (
    Number(inv.items[index].quantity) >
    Number(targetinput.getAttribute("value"))
  ) {
    targetinput.setAttribute(
      "value",
      (Number(targetinput.getAttribute("value")) + 1).toString()
    );

    updatetotal();
  }
}
function minusItem(element) {
  var targetinput = document.getElementById(
    "input" + element.getAttribute("targetInputIndex")
  );
  if (Number(targetinput.getAttribute("value")) > 0) {
    targetinput.setAttribute(
      "value",
      (Number(targetinput.getAttribute("value")) - 1).toString()
    );
    updatetotal();
  }
}

function initInput(element) {
  if (
    element.value == "" ||
    Number(element.value) == NaN ||
    Number(element.value) < 0
  )
    element.value = "0";
  if (
    Number(element.value) >
    Number(inv.items[Number(element.getAttribute("index"))].quantity)
  )
    element.value = inv.items[Number(element.getAttribute("index"))].quantity;
  updatetotal();
}

function updatetotal() {
  var result = 0;
  for (var i = 0; i < inv.items.length; i++) {
    inputs[i] = document.getElementById("input" + i);
    if (Number(inputs[i].getAttribute("value")) != NaN)
      result +=
        Number(inputs[i].getAttribute("value")) *
        Number(inv.items[i].sellPrice);
  }

  total.innerHTML = result;
}

sellButton.onclick = function () {
  if (total.innerHTML != "0") {
    var today = new Date();
    var soldeItems = [];
    var buyprice = 0;
    for (var i = 0; i < inv.items.length; i++) {
      var val = Number(inputs[i].getAttribute("value"));
      if (val != NaN && val > 0) {
        buyprice += val * Number(inv.items[i].buyPrice);
        inv.items[i].quantity -= val;
        soldeItems.push({
          type: inv.items[i].type,
          ref: inv.items[i].ref,
          name: inv.items[i].name,
          quantitySold: val,
          buyPrice: inv.items[i].buyPrice,
          sellPrice: inv.items[i].sellPrice
        });
      }
    }
    fs.writeFileSync(
      path.resolve(__dirname, "js/inventory.json"),
      JSON.stringify(inv)
    );
    dialog.showMessageBox(
      {
        message: "the inventory has been updated",
        title: "Inventory updated",
      },
      () => {}
    );

    var sale = {
      date:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate(),
      buyPrice: buyprice,
      sellPrice: Number(total.innerHTML),
      itemsSolde: soldeItems,
    };
    inv.transactions.push(sale);
    fs.writeFileSync(
      path.resolve(__dirname, "js/inventory.json"),
      JSON.stringify(inv)
    );
    document.location.reload(true);
  }
};

searchbar.oninput = () => {
  var searchitem = document.getElementById("searchbar").value;
  items = [...document.getElementsByClassName("item-box")];

  for (var i = 0; i < inv.items.length; i++) {
    if (items[i].id.includes(searchitem)) items[i].style.display = "inline";
    else items[i].style.display = "none";
  }
};
