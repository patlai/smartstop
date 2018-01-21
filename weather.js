window.onload = function(){
	var frame = document.createElement('iframe');
	frame.src = "https://darksky.net/forecast/45.4972,-73.6104/us12/en";
	frame.id = "weatherFrame";
	var screenHeight = window.screen.availHeight;
    var screenWidth = window.screen.availWidth;
    frame.height = screenHeight;
    frame.width = screenWidth;
    document.body.appendChild(frame);
    // document.getElementById('weatherFrame').height = screenHeight;
    // document.getElementById('weatherFrame').width = screenWidth;
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
	    }
	  });
	}
}).use('screenPosition', {scale: 0.5});