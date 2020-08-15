//Create variables here
var dog, happyDog;
var database;
var foodS, foodStock;
var dogImage;
var happydogImage;
var addFoodButton, foodDogButton;
var hour;
var fedTime, lastFed;
var foodObj;
var gameState = " ";
var bedroomImage;
var gardenImage;
var washroomImage;
var readState;
var changeState;
var lazyImage;

function preload()
{
  //load images here
  dogImage = loadImage("images/dogImg.png")
  happydogImage = loadImage("images/dogImg1.png")
  bedroomImage = loadImage("vpi/vpi/BedRoom.png")
   gardenImage = loadImage("vpi/vpi/Garden.png")
   washroomImage = loadImage("vpi/vpi/Wash Room.png")
   lazyImage = loadImage("vpi/vpi/Lazy.png");

  //foodS = 0;
  
}

function setup() {
  createCanvas(550, 500);
  database = firebase.database();

  dog = createSprite(450, 290, 50, 50);
  //dog.addImage(dogImage);
  dog.scale = 0.20;

  foodObj = new Food();
  
  var food = database.ref('Food');
  food.on("value", readPosition, showError);

  feed = createButton("Feed the Dog");
  feed.position(800, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900, 95);
  addFood.mousePressed(addFoods);

  
readState = database.ref('gameState');
readState.on("value", function(data){
gameState = data.val();
});

}


function draw() {  
  background(46, 139, 87);

  if (gameState!== "Hungry"){
    feed.hide();
    addFood.hide();
    //dog.remove();
  }
  else{
   
  }
  

  // if(keyWentDown(UP_ARROW)){
  //   writeStock(foodS);
  //   dog.addImage(happydogImage);
  // }
 
  drawSprites();
  textSize(20);
  fill("white");
 drawSprites();

  text("Food Stock:" , 20, 100);
  text(foodS, 140, 100); 
  lastFed = database.ref('Hour');
  lastFed.on("value", readHour);
  text("Last Feed: " + lastFed + " o' clock", 15, 50);
 
  //add styles here
  getHour();
  currentTime = parseInt(hour,10);
  lastFed = parseInt(lastFed, 10);
  console.log(currentTime);
  console.log(lastFed+1);

  if(currentTime ===(lastFed+1)){
    update("Playing");
    foodObj.garden();
    console.log("1");
  }
  else if(currentTime ===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();

  }
  else if(currentTime >(lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodObj.washroom();

  }
  else{
    update("Hungry");
    foodObj.display();
    feed.show();
    addFood.show();
    dog.addImage(lazyImage);
    console.log("!");
  }
 }

 function readPosition(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readHour(data){
  lastFed = data.val();

}


function showError(){
  console.log("Error in writing to the database");
}

async function feedDog(){
  //dog.addImage(happydogImage);
  
  getHour();
  //console.log(hour)
  // database.ref('/').update({
  //   Hour:hour
  // })

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
   Food:foodObj.getFoodStock(),
   Hour:hour 
  })
  
}

function addFoods(){
  foodS++;
    database.ref('/').update({
    Food:foodS
  })
 
}

async function getHour(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  //console.log(responseJSON);
  //console.log(responseJSON.datetime);
  
  var datetime = responseJSON.datetime;
  hour = datetime.slice(11,13);
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}