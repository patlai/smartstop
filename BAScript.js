var map, infoWindow;
var pos;
var closestStop;
var map, popup;
var foundClosest = false;
var closestLat, closestLon;
var googleLatLng;
var busWebPage = "https://transitfeeds.com/p/societe-de-transport-de-montreal/39/latest/stop/";
var markers = [];
var info;

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
       //window.scrollBy(0, -10);
       map.setZoom(map.zoom + 1);
    } else if(newYPosition < 0.15 * screenHeight){
      //window.scrollBy(0, 10);
      map.setZoom(map.zoom - 1);
    }

    // click detection
    frame.gestures.forEach(function(gesture){
      switch (gesture.type){
        case "circle":
          console.log("Circle Gesture");
          window.location.href = 'leap.html';
          break;
      // case "screenTap":
      //     map.zoom = map.zoom + 5;
      //     break;

      }
    });
  }
}).use('screenPosition', {scale: 0.5});

function initMap() {
  var mapPromise = new Promise((resolve, reject) => {
    // ...code that does something, ultimately calls either resolve or reject
  
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.504449, lng: -73.615096},
        zoom: 18
        });
    
    infoWindow = new google.maps.InfoWindow;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here');
        infoWindow.open(map);
        map.setCenter(pos);
          
        console.log(pos);
        console.log("map displayed successfully");
        resolve();
          
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  mapPromise.then( () => {
    console.log("ggg");
    myLocation();
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function displayRestaurants() {
    clearMarkers();
    var request = {
        location: pos,
        radius: '1000',
        type: ['restaurant']
      };

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      map.setZoom(14);
      map.panTo(pos);
    
}

function displayShopping() {
    clearMarkers();
    var request = {
        location: pos,
        radius: '1000',
        type: ['store']
      };

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      map.setZoom(14);
      map.panTo(pos);
    
}

function displayBusStops(){
    if(foundClosest){
        popup = new google.maps.Marker({
            position: googleLatLng,
            map: map,
            title: 'Closest Bus Stop'
        });
        markers.push(popup);
        clearMarkers();
        popup.setMap(map);
        map.setCenter(googleLatLng);
        map.setZoom(17);
        map.panTo(googleLatLng);
    }
}

function myLocation(){
    clearMarkers();
    map.setCenter(pos);
    map.setZoom(17);
    map.panTo(pos);
    $.getJSON('https://raw.githubusercontent.com/patlai/patlai.github.io/master/json/stops.json', function(result){
    console.log(result);
    //var myStop = Math.abs(result[0]["stop_lat"]);
    //console.log(myStop);
    
    var closestStop = result[0];
    var distClosestLat = Math.abs(closestStop["stop_lat"] - pos["lat"]);
    var distClosestLong = Math.abs(pos["lng"] - closestStop["stop_lat"]);
    var i;
        
    for (i=1; i<9191; i++){
        
        if(result[i]){
            
            if (((Math.abs(result[i]["stop_lat"] - pos["lat"])) < distClosestLat)){
                if((Math.abs(pos["lng"] - result[i]["stop_lon"])) < distClosestLong){
                    closestStop = result[i];
                    distClosestLat = Math.abs(closestStop["stop_lat"] - pos["lat"]);
                    distClosestLong = Math.abs(closestStop["stop_lon"] - pos["lng"]);
                    console.log(distClosestLat); 
                    console.log(distClosestLong);
                }
            }
        }
    }
    
    console.log(closestStop);
    closestLat = closestStop["stop_lat"];
    closestLon = closestStop["stop_lon"];
    document.getElementById("busStopSite").src = busWebPage + closestStop["stop_id"];
    console.log(document.getElementById("busStopSite"));
    googleLatLng = new google.maps.LatLng(closestLat, closestLon);
    foundClosest = true;
    
    });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
    info = new google.maps.InfoWindow();
    var placeLoc = place.geometry.location;
    var mark = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    markers.push(mark);
    google.maps.event.addListener(mark, 'click', function() {
      info.setContent('<h2 id="firstHeading" class="firstHeading">'+place.name+'</h2>'+
            '<div id="bodyContent" >'+
            '<p><i>Rating: '+place.rating+'\n</i>');
      info.open(map, this);
    });
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);         
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers
    markers = [];
}