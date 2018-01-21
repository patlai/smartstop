// client secret: jjKFbw2PCmT5LNK24WFGyKIvzlerHVK3PGGKhYVp
// api key = Qn9qL1NrlbWwz8Gc9ppTsvADtdb9vf

window.onload = function(){
	getEvents();
}

function getEvents(){
	header = {
		"Authorization": "Bearer Qn9qL1NrlbWwz8Gc9ppTsvADtdb9vf",
		//"location": [45.5087, -73.554]
	};

	url = "https://api.predicthq.com/v1/events?country=CA?category=concerts";

	$.ajax({
		url: url,
		type: 'GET',
		headers : header,
	}).done(function(response){
		console.log(response)
	});
}
