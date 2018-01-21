var joke;

window.onload = function(){
	requestFacts();
}

function requestFacts(){
	//var url = "https://catfact.ninja/fact";
	//var url = "https://the-cat-fact.herokuapp.com/api/facts";
	var url = "https://icanhazdadjoke.com/";
	$.getJSON(url, function(result){
		console.log(result);
		joke = result["joke"];
	}).then(function(){
		document.getElementById('jokeHeader').innerHTML = joke;
	});
}

Leap.loop(function(frame) {
	// get the first hand since the menu is only intended to be operated using one hand
	var hand = frame.hands[0];
	// if a hand is detected in the frame...
	if(hand){

	  fingerPosition = hand.indexFinger.tipPosition;
	  screenHeight = window.screen.availHeight;
	  screenWidth = window.screen.availWidth;

	  //console.log(fingerPosition);

	  newXPosition = (fingerPosition[0] + 200) *  (screenWidth/400);
	  newYPosition = (fingerPosition[1] - 20) *  (screenWidth/430);

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
        case "circle":
          console.log("Circle Gesture");
          window.location.href = 'leap.html';
          break;
        case "screenTap":
          console.log("screenTap Gesture");
          requestFacts();
          break;
	    }
	  });
	}
}).use('screenPosition', {scale: 0.5});


