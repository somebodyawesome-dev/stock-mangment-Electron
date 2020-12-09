var fs = require('fs');
const { type } = require('os');
var path = require('path');
const { dialog } = require('electron').remote;



var rawData=fs.readFileSync(path.resolve(__dirname,'js/inventory.json'));
var inv = JSON.parse(rawData);
inv.items.sort((a,b) =>{
    return a.type>b.type? -1:(a.type == b.type? 0 :1);
})

var invBox=document.getElementById('inv-box');
var editBox=document.getElementById('edit-box');
editBox.style.display='none';




var originItem={};



var cancelButt=document.getElementById('cancelButton');
var saveButt=document.getElementById('saveButton');

var ref = document.getElementById('ref');
var prod = document.getElementById('prod');
var quantity = document.getElementById('quantity');
var buyPrice = document.getElementById('buyPrice');
var sellPrice = document.getElementById('sellPrice');
var minQuantity = document.getElementById('minimumQuantity');

updateInventory();

function updateInventory(){
    rawData=fs.readFileSync(path.resolve(__dirname,'js/inventory.json'));
    inv = JSON.parse(rawData);
    invBox.innerHTML=`
    <div class="title"> 
        <span class="info-title">Name of Product</span>
        <span class="info-title">Type</span>
        <span class="info-title">Reference</span>   
        <span class="info-title">Quantity</span>
        <span class="info-title">Buy Price</span>
        <span class="info-title">Sell Price</span>
        <span class="info-title">Min Quantity</span> 
    </div>        
    `;


    for(var  i  = 0 ; i < inv.items.length ; i++){

        var shortage=(Number(inv.items[i].quantity) <=Number(inv.items[i].minQuantity) ?'shortage':'');
        var item=`<div class="item-box ${shortage}" oncontextmenu="changepos(${i})" onclick=editItem(${i})>
        <div class="info-box">
            <p class="info">${inv.items[i].name}</p>
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].type}</p>
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].ref}</p>  
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].quantity}</p>  
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].buyPrice}</p>  
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].sellPrice}</p>  
        </div>
        <div class="info-box">
            <p class="info">${inv.items[i].minQuantity}</p>  
        </div>
        </div>`
        invBox.innerHTML += item;
    }
   

}

var arrowBox=document.getElementById('arrow-box');
arrowBox.style.display='none';

function changepos(index){
    
    arrowBox=document.getElementById('arrow-box');
    arrowBox.style.display='flex';
    arrowBox.style.position='absolute'
    arrowBox.style.top= 50+'vh';
    arrowBox.style.left=80+'vw';
    originItem.teleIndex=index;
   

}
async function editItem(index){
    item=inv.items[index];
    item.index = index;
    originItem.index=index;
    editBox.style.display='block';
    ref.value=item.ref;
    prod.value=item.name;
    quantity.value=item.quantity;
    buyPrice.value=item.buyPrice;
    sellPrice.value=item.sellPrice;
    minQuantity.value=item.minQuantity;

}




saveButt.onclick=function (){

    
    var newProd={
        type : document.getElementById('slct').value,
        ref: ref.value,
        name: prod.value,
        quantity: quantity.value,
        buyPrice: buyPrice.value,
        sellPrice: sellPrice.value,
        minQuantity: minQuantity.value,
    } 
    
    if(isValide(newProd)){
        inv.items[originItem.index]=newProd;
        fs.writeFileSync(path.resolve(__dirname,'js/inventory.json'),JSON.stringify(inv));
       
        
       dialog.showMessageBox({
           message:'the product has been updated',
           title:'Inventory Update'
       },() =>{
           
       })
       editBox.style.display='none';
       updateInventory();
        
    }else{
        dialog.showErrorBox('Error','reference already Exist or one of the information is invalid')
        
    }

}


cancelButt.onclick=function (){
    editBox.style.display='none';
}  


function isValide(obj){
    if(obj.ref == "" || obj.name == "" || obj.quantity == "" || obj.buyPrice == "" || obj.sellPrice == "" || obj.minQuantity == "") return false;
    if(Number(obj.quantity) == NaN || Number(obj.buyPrice) == NaN ||  Number(obj.sellPrice) == NaN || Number(obj.minQuantity) == NaN) return false;
    for(var i = 0 ; i < inv.items.length ; i++){
        if(originItem.index != i && inv.items[i].ref == obj.ref) return false;
    }
    return true;
} 




var upbtn=document.getElementById('upbtn');

upbtn.onclick= ()=>{
    if(originItem.teleIndex > 0){
        var temp = inv.items[originItem.teleIndex];
        inv.items[originItem.teleIndex]=inv.items[originItem.teleIndex-1];
        inv.items[originItem.teleIndex-1]=temp;
        originItem.teleIndex--;
        fs.writeFileSync(path.resolve(__dirname,'js/inventory.json'),JSON.stringify(inv));
        updateInventory();
    }
    return false;
}


var downbtn=document.getElementById('downbtn');
downbtn.onclick=()=>{
    if(originItem.teleIndex< inv.items.length-1){
        var temp = inv.items[originItem.teleIndex];
        inv.items[originItem.teleIndex]=inv.items[originItem.teleIndex+1];
        inv.items[originItem.teleIndex+1]=temp;
        originItem.teleIndex++;
        fs.writeFileSync(path.resolve(__dirname,'js/inventory.json'),JSON.stringify(inv));
        updateInventory(); 
    }


    return false;
}