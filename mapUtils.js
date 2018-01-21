var map;
var currentPosition;

window.onload = function() {
  getLocation();
};

function initMap(lat, long) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: long},
    zoom: 16
  });
}

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }

function showPosition(position) {
  currentPosition = [position.coords.latitude, position.coords.longitude]
  initMap(currentPosition[0], currentPosition[1])
  console.log(currentPosition)
    // console.log("Latitude: " + position.coords.latitude + 
    // "<br>Longitude: " + position.coords.longitude); 
}

  document.read
}

//&callback=initMap