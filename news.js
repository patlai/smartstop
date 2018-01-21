var articles = [];


Leap.loop(function(frame) {
var hand = frame.hands[0];
	// if a hand is detected in the frame...
	if(hand){
	  fingerPosition = hand.indexFinger.tipPosition;
	}

});

function GetNewsArticles(){
	//var url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=fc328bb6a26e4942add142e154465804";
	var url = "https://patlai.github.io/json/canada.json";
	articles = [];
	$.getJSON(url, function(result){
		console.log(result);
		articles = result["articles"]
	}).then(function(){
        for(i = 0; i < articles.length; i++){
        	//console.log(articles[i].title);
        	var articleRow = document.createElement('row');
        	articleRow.style.height = "100px";
        	var articleButton = document.createElement('button');
        	articleButton.innerHTML = "<h3>" + articles[i]["title"] + "</h3>Source: " + articles[i]["source"]["name"];
        	articleButton.style.width = "110%";
        	articleButton.style.height = "100px";
        	if(i%2 != 0){
        		articleButton.style["background-color"] = "#3a85ff";
        	}
        	articleButton.classList.add('btn');
        	articleButton.classList.add('btn-primary');
        	articleButton.classList.add('btn-block');
        	//articleButton.onclick = "window.location.href='" + articles[i].url + "'";
        	//articleButton.onclick = "window.location.href='google.com'";

        	articleButton.onclick = function f(){
        		// console.log(articles)
        		// window.location.href = articles[i].url;
        	}
        	articleRow.appendChild(articleButton);
        	document.getElementById("newsContainer").appendChild(articleRow);
        }
        var newsAPIRow = document.createElement('row');
        newsAPIRow.innerHTML = "<center>Powered by newsapi</center>";
        document.getElementById("newsContainer").appendChild(newsAPIRow);
        InitButtonsArray();
      });
}


var buttonIDs = {}
var buttonPositions;

window.onload = function(){
  var cursor = document.createElement('img');
  //cursor.src = 'cursor.png';
  cursor.id = 'cursor';
  cursor.style.position = 'absolute';
  cursor.style.left = "50px";
  cursor.style.top = "50px";
  document.body.appendChild(cursor);
  GetNewsArticles();
}

 // if the window is resized, the position of the buttons will change
// so reinitialize that array
// in a real world case, the window will always be fix sized, but just to be sure...
window.onresize = function(){
  InitButtonsArray();
}

Leap.loop(function(frame) {
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

	  //console.log(fingerPosition);

	  newXPosition = (fingerPosition[0] + 200) *  (screenWidth/400);
	  newYPosition = (fingerPosition[1] - 20) *  (screenWidth/430);

	  var cursor = document.getElementById('cursor');
	  cursor.style.left = '' + newXPosition + "px";
	  cursor.style.top = '' + (screenHeight-newYPosition) + "px";
	  //console.log(fingerPosition)

	  console.log([newXPosition,newYPosition]);

	  // scroll if the cursor is at the top 10% or bottom 15% of the screen;
	  if(newYPosition > 0.9*screenHeight){
	  	 window.scrollBy(0, -10);
	  } else if(newYPosition < 0.15 * screenHeight){
	  	window.scrollBy(0, 10);
	  }

	  // click detection
	  frame.gestures.forEach(function(gesture){
	    switch (gesture.type){
	      case "screenTap":
	        console.log("Screen Tap Gesture. X: " + newXPosition + ", Y: " + (screenHeight-newYPosition));
	        HandleClick(newXPosition, screenHeight-newYPosition);
	        break;
        case "swipe":
          console.log("Swipe Gesture");
          break;
        case "circle":
              console.log("Circle Gesture");
              window.location.href = 'leap.html';
              break;
	    }
	  });
	}
  
}).use('screenPosition', {scale: 0.5});

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
