var cats = {};

//apikey123
//fc328bb6a26e4942add142e154465804
//https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=fc328bb6a26e4942add142e154465804


var buttonIDs = {}
var buttonPositions;

window.onload = function(){
  document.getElementById("out").style.display = 'none';
  document.getElementById("output").style.display = 'none';
  var cursor = document.createElement('img');
  cursor.src = 'cursor.png';
  cursor.id = 'cursor';
  cursor.style.position = 'absolute';
  cursor.style.left = "50px";
  cursor.style.top = "50px";
  document.body.appendChild(cursor);
  InitButtonsArray();
}

 // if the window is resized, the position of the buttons will change
// so reinitialize that array
// in a real world case, the window will always be fix sized, but just to be sure...
window.onresize = function(){
  InitButtonsArray();
}

Leap.loop(function(frame) {

  // frame.hands.forEach(function(hand, index) {
    
  //   var cat = ( cats[index] || (cats[index] = new Cat()) );    
  //   cat.setTransform(hand.screenPosition(), hand.roll());
    
  // });

// var pointables = frame.pointables;
// for(i = 0; i < pointables.length; i++){
//   console.log(pointables[i].id + ", position: " + pointables[i].tipPosition);
// }



// get the first hand since the menu is only intended to be operated using one hand
var hand = frame.hands[0];
// if a hand is detected in the frame...
if(hand){
  // var finger = hand.fingers[0];
  // the position of the cursor will be the index finger of the user
  // x position range: [-300, 300] -> need to map it to screen
  // y position range: [20, 450]

  fingerPosition = hand.indexFinger.tipPosition;
  screenHeight = window.screen.availHeight;
  screenWidth = window.screen.availWidth;

  newXPosition = (fingerPosition[0] + 200) *  (screenWidth/400);
  newYPosition = (fingerPosition[1] - 20) *  (screenWidth/430);

  var cursor = document.getElementById('cursor');
  cursor.style.left = '' + newXPosition + "px";
  cursor.style.top = '' + (screenHeight-newYPosition) + "px";
  //console.log(fingerPosition)

  // click detection
  frame.gestures.forEach(function(gesture){
    switch (gesture.type){
      case "screenTap":
        console.log("Screen Tap Gesture. X: " + newXPosition + ", Y: " + (screenHeight-newYPosition));
        HandleClick(newXPosition, screenHeight-newYPosition);
        break;
      // case "keyTap":
      //   console.log("Key Tap Gesture");
      //   HandleClick(newXPosition, screenHeight-newYPosition);
      //   break;
    }
  });
}

  
  
}).use('screenPosition', {scale: 0.25});

var Cursor = function(pos){
  var cursor = document.createElement('img');
  cursor.src = 'cursor.png';
  cursor.style.position = 'absolute';
  cursor.onload = function() {

  }
}

// choose which button to click when a screen tap gesture is sent
var HandleClick = function(x,y){
  //console.log([x,y]);
  for (i=0; i < buttonPositions.length; i++){
    //console.log(buttonPositions[i]["boundingBox"]);
    if(x >= buttonPositions[i]["boundingBox"].left
      && x <= buttonPositions[i]["boundingBox"].right
      && y >= buttonPositions[i]["boundingBox"].top
      && y <= buttonPositions[i]["boundingBox"].bottom)
    {
      buttonPositions[i]["button"].click();
      console.log(buttonPositions[i]["button"].id + " clicked!");
      break;
    }
  }
}

// makes an array of buttons and their centers on the screen
var InitButtonsArray = function(){
  buttonPositions = [];
  var buttons = document.getElementsByTagName('button');
  //console.log(buttons);
  for(i = 0; i < buttons.length; i++){
    // use the bounding box of the element to get the center of the element
    //console.log(buttons[i])
    var boundingBox = buttons[i].getBoundingClientRect();
    var yCenter = (boundingBox.x + boundingBox.width) / 2;
    var xCenter = (boundingBox.y + boundingBox.height) / 2;
    //console.log(boundingBox);
    buttonPositions.push({"button": buttons[i], "boundingBox": boundingBox});
    //console.log([xCenter, yCenter]);
  }
  console.log(buttonPositions);
}

var Cat = function() {
  var cat = this;
  var img = document.createElement('img');
  img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/109794/cat_2.png';
  img.style.position = 'absolute';
  img.onload = function () {
    cat.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    document.body.appendChild(img);
  }
  
  cat.setTransform = function(position, rotation) {

    img.style.left = position[0] - img.width  / 2 + 'px';
    img.style.top  = position[1] - img.height / 2 + 'px';

	img.style.transform = 'rotate(' + -rotation + 'rad)';
	
    img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    img.style.OTransform = img.style.transform;

  };

};

var simulateClick = function (elem) {
  // Create our event (with options)
  var evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  // If cancelled, don't dispatch our event
  var canceled = !elem.dispatchEvent(evt);
};

//cats[0] = new Cat();

// This allows us to move the cat even whilst in an iFrame.
Leap.loopController.setBackground(true) 