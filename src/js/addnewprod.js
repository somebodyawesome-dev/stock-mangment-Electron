var fs = require("fs");
var path = require("path");
const { dialog } = require("electron").remote;

let rawData = fs.readFileSync(path.resolve(__dirname, "js/inventory.json"));
var inv = JSON.parse(rawData);

var type = document.getElementById("slct");
var ref = document.getElementById("ref");
var prod = document.getElementById("prod");
var quantity = document.getElementById("quantity");
var buyPrice = document.getElementById("buyPrice");
var sellPrice = document.getElementById("sellPrice");
var minQuantity = document.getElementById("minimumQuantity");
var addButt = document.getElementById("addButton");

addButt.onclick = function () {
  var newProd = {
    type: type.value,
    ref: ref.value,
    name: prod.value,
    quantity: quantity.value,
    buyPrice: buyPrice.value,
    sellPrice: sellPrice.value,
    minQuantity: minQuantity.value,
  };

  if (isValide(newProd)) {
    inv.items.push(newProd);
    fs.writeFileSync(
      path.resolve(__dirname, "js/inventory.json"),
      JSON.stringify(inv)
    );

    document.location.reload(true);
    dialog.showMessageBox(
      {
        message: "the product has been added",
        title: "product Added",
      },
      () => {}
    );
  } else {
    dialog.showErrorBox(
      "Error",
      "reference already Exist or one of the information is invalid"
    );
  }

  return false;
};

function isValide(obj) {
  if (obj.type == "Type") return false;
  if (
    obj.ref == "" ||
    obj.name == "" ||
    obj.quantity == "" ||
    obj.buyPrice == "" ||
    obj.sellPrice == "" ||
    obj.minQuantity == ""
  )
    return false;
  if (
    Number(obj.quantity) == NaN ||
    Number(obj.buyPrice) == NaN ||
    Number(obj.sellPrice) == NaN ||
    Number(obj.minQuantity) == NaN
  )
    return false;
  for (var i = 0; i < inv.items.length; i++) {
    if (inv.items[i].ref == obj.ref) return false;
  }
  return true;
}
