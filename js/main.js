let day = 1;
let dayMax = 20;
let health = 100;
let itemToPurchaseIndex;
let itemToSellIndex;
let money = 1000;
let playerLocationIndex = 0; //default location is cities[0]
let storageCap = 500;
let storageAvail = storageCap;
document.querySelector("#travelButton1").disabled = true


function Item(name, min, max, price, qtyOwned, id, availProb){
  this.name = name
  this.minPrice = min //min price item can be
  this.maxPrice = max //max price item can be
  this.price = price
  this.qtyOwned = qtyOwned
  this.id = id //id name of DOM without hashtag
  this.availProb = availProb //probability of item being available for purchase/sale
}

item1 = new Item("Water", 5, 9, 0, 0, "item1", 0.96)
item2 = new Item("Food", 4, 10, 0, 0, "item2", 0.96)
item3 = new Item("Tools", 6, 12, 0, 0, "item3", 0.92)
item4 = new Item("Medicine", 8, 15, 0, 0, "item4", 0.88)
item5 = new Item("Weapons", 12, 22, 0, 0, "item5", 0.85)
item6 = new Item("Armor", 15, 36, 0, 0, "item6", 0.80)
let items = [item1, item2, item3, item4, item5, item6] //object array of all purchasable items

function City(name, supplyFactor, demandFactor){
  this.name = name;
  this.supplyFactor = supplyFactor;
  this.demandFactor = demandFactor;
}

city1 = new City("LA", "0", "0")
city2 = new City("NY", "0", "0")
city3 = new City("Miami", "0", "0")
city4 = new City("Boca", "0", "0")
city5 = new City("Burrito", "0", "0")
city6 = new City("Russia", "0", "0")

let cities = [city1, city2, city3, city4, city5, city6]

calculateSupplyAndDemand()
printCities()
printMoney()
printDay()
clearQty()
generatePrices()
printInventory()

document.querySelector("#buyButton").addEventListener("click", buy)
document.querySelector("#sellButton").addEventListener("click", sell)

const group = document.querySelectorAll(".itemForSale")
for(i=0;i<group.length;i++){
  group[i].addEventListener("click", clickItemToBuy)
}

const group2 = document.querySelectorAll(".itemOwned")
for(i=0;i<group2.length;i++){
  group2[i].addEventListener("click", clickItemToSell)
}

const group3 = document.querySelectorAll(".tb")
for(i=0;i<group3.length;i++){
  group3[i].addEventListener("click", travel)
}


function buy(){
  let totalCost =   items[itemToPurchaseIndex].price * document.querySelector("#qty").value

  //check to see if player has enough money to purchase qty enetered
  if(totalCost>money){
    document.querySelector("#messages").innerText = "Not enough money"
  }
  //check to see if qty is > 0
  else if (document.querySelector("#qty").value < 1){
    document.querySelector("#messages").innerText = "Huh?"
  }
  //check to see if qty entered is a number
  else if(isNaN(document.querySelector("#qty").value)){
    document.querySelector("#messages").innerText = "What the?"
  }
  //check to see if you have enough space for more items
  else if(document.querySelector("#qty").value>storageAvail){
    document.querySelector("#messages").innerText = "Not enough storage"
  }



  else{
    money = money - totalCost
    document.querySelector("#messages").innerText = "Sold!"

    items[itemToPurchaseIndex].qtyOwned = items[itemToPurchaseIndex].qtyOwned + parseInt(document.querySelector("#qty").value)
    //alert(`You bought ${document.querySelector("#qty").value} and now own ${items[itemToPurchaseIndex].qtyOwned}`)
    calculateStorage()
    printMoney()
    printInventory()
    clearHighlights()
    clearQty()

  }


}
function calculateSupplyAndDemand(){
  //create a supply string and a demand string of numbers -> interpret string
  //in generatePrices
  for(i=0;i<cities.length;i++){//----------------------cycle through each city
    let num
    let supplyString = ""
    let demandString = ""
    for(k=0;k<items.length;k++){//get a 2 decimal number for every item, combine into single string
        num = (Math.random().toFixed(2)*100).toString()
        if(num.length!=2){
          k=k-1
        }
        else{
        supplyString = supplyString + num
        }
    }
    cities[i].supplyFactor = supplyString

  //alert(cities[i].name + " sFactor = " + cities[i].supplyFactor + "length = " + cities[i].supplyFactor.length )

    for(k=0;k<items.length;k++){
      num = (Math.random().toFixed(2)*100).toString()
      if(num.length!=2){
        k=k-1
      }
      else{
      demandString = demandString + num
      }
    }
    cities[i].demandFactor = demandString
    //alert(cities[i].name + " dFactor = " + cities[i].demandFactor + "length = " + cities[i].demandFactor.length )
  }
}
function clickItemToBuy(chosenItem){
  //alert(chosenItem.srcElement.id)
  document.querySelector("#messages").innerText = ""

  for(i=0; i<items.length; i++){
    let loc = "#item" + (i + 1)

    if(chosenItem.srcElement.id == items[i].id){
      document.querySelector("#qty").value = Math.floor(money / items[i].price)
      calculateStorage()
      if(document.querySelector("#qty").value > storageAvail){
        document.querySelector("#qty").value = storageAvail
      }



      clearHighlights()
    //  items[i].location.style.background = "lightblue"
      document.querySelector(loc).style.background = "darkgray"
      itemToPurchaseIndex = i
    }
//srcElement
  }
}
function clickItemToSell(chosenItem){
  //alert(chosenItem.srcElement.id)
  document.querySelector("#messages").innerText = ""

  for(i=0; i<items.length; i++){
    //document.querySelector(chosenItem.srcElement.id).style.background = "lightblue"
    let  loc = 'inv' + (i+1)
    if (chosenItem.srcElement.id==loc){
      loc = "#" + loc
      clearHighlights()
      itemToSellIndex = i
      document.querySelector(loc).style.background = "#1a3cc4"
    }
  }
  document.querySelector("#qtyToSell").value = items[itemToSellIndex].qtyOwned
}
function generatePrices(){
  //#item1
  for (i=0; i<items.length; i++){
  let loc = "#item" + (i + 1)
  document.querySelector(loc).innerText = ""
}

  for (i=0; i<items.length; i++){
    if(items[i].availProb - Math.random()<0){
      items[i].price = -1 //give -1 price for sell() so you can't see item not shown
      //nothing happens - item not shown
    }
    else{
      let loc = "#item" + (i + 1)

// 0-01
// 1-23
// 2-45   i will need positions i*2 and i*2+1 from supplyFactor and demandFactor string
// 3-67
// 4-89

      let sliceNum = cities[playerLocationIndex].demandFactor
      sliceNum = sliceNum.slice(i*2, (i*2)+2)
      sliceNum = parseInt(sliceNum)
      sliceNum = (sliceNum - 50)/100
      items[i].price = Math.floor((Math.random()*(items[i].maxPrice + 1))+items[i].minPrice)

      if(sliceNum<=0){
        items[i].price = Math.floor(items[i].price * (1-(-1 * sliceNum)))
      }
      else{
        items[i].price = Math.floor(items[i].price * (1+sliceNum))
      }

      //alert(items[i].name + "  " + sliceNum*100 + "%")
      //alert(i + " " + cities[playerLocationIndex].supplyFactor + " " + sliceNum)






      document.querySelector(loc).innerText = items[i].price + " " + items[i].name
    }
  }
}
function sell(){

  //check to see that itemToSellIndex has a value. Gets value from func. clickItemToSell
  //once something in the inventory is clicked
  if (typeof itemToSellIndex == 'undefined'){
   //document.querySelector("#messages").innerText = "Select what you want to sell?"
 }
 //checks to make sure the amount you are selling isn't more than you own
   else if(document.querySelector("#qtyToSell").value > items[itemToSellIndex].qtyOwned){
    document.querySelector("#messages").innerText = "You don't have that many"
  }
  else if(document.querySelector("#qtyToSell").value == ""){
    //alert("do something")
  }
  else if(items[itemToSellIndex].price == -1){
    document.querySelector("#messages").innerText = "Can't trade that item"
  }
  //adds profits to money and deducts qty sold from inventory
  else{
    money = money + (document.querySelector("#qtyToSell").value * items[itemToSellIndex].price)
    items[itemToSellIndex].qtyOwned = items[itemToSellIndex].qtyOwned - document.querySelector("#qtyToSell").value
    document.querySelector("#messages").innerText = "Sold"

    printMoney()
    printInventory()
    clearQty()
    clearHighlights()
  }
}
function printMoney(){
  document.querySelector("#money").innerText = "$" + money
}
function printDay(){
  document.querySelector("#day").innerText = "Day " + day
}
function clearQty(){
  document.querySelector("#qty").value = ""
  document.querySelector("#qtyToSell").value = ""

}
function printInventory(){
  document.querySelector("#space").innerText = `${storageCap-storageAvail} / ${storageCap}`
  for (i=0; i<items.length; i++){
    let  loc = '#inv' + (i+1)
    document.querySelector(loc).innerText = items[i].qtyOwned + " " + items[i].name
    if(items[i].qtyOwned == 0){
      document.querySelector(loc).innerText = ""
    }

  }


}
function printCities(){
  for(i=0;i<cities.length;i++){
    let loc = "#travelButton"
    document.querySelector(loc + (i+1)).innerText = cities[i].name
  }
}
function clearHighlights(){
  for(j=0; j<items.length;j++){
    let locat = "#item" + (j+1)
    document.querySelector(locat).style.background = "lightgray"
    //items[j].location.style.background = "white"
    //clears Invetory Side
    let  loc = '#inv' + (j+1)
    document.querySelector(loc).style.background = "#4388f7"
  }

}
function travel(chosenItem){

  for(i=0;i<cities.length;i++){
   let loc = "#travelButton" + (i+1)
   document.querySelector(loc).disabled = false
 }

    //sets playerLocationIndex
   for(i=0;i<cities.length;i++){
    let loc = "travelButton" + (i+1)
    if(chosenItem.srcElement.id==loc){
      playerLocationIndex = i
      document.querySelector("#"+loc).disabled = true
    }
   }
          //should make all travelButtons clickable/none disabled




  day = day + 1
  if(day>=dayMax){
    document.querySelector("#messages").innerText = "Game Over"
    if (day==dayMax){
      generatePrices()
    }
    day = dayMax
    printDay()
    clearQty()
    clearHighlights()
  } else{
    generatePrices()
    printDay()
    clearQty()
    clearHighlights()
    document.querySelector("#messages").innerText = ""
  }

}
function calculateStorage(){
    storageAvail = storageCap
  for(k=0;k<items.length;k++){
    storageAvail = storageAvail - items[k].qtyOwned
  }
}

//const person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
//document.querySelector("#random").innerText = ranNum
//document.getElementById("random").style.color = "black"
