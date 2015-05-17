// Install via: 
// 		npm install sentiment
// 		npm install request
// then to run, type:
// 		node app.js

var fs = require("fs");
var host = "127.0.0.1";
var port = 1337;
var express = require("express");
var sentiment = require('sentiment');
var request = require('request');

// Express web server
var app = express();
//app.use(app.router); //use both root and other routes below
app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder

app.get("/", function(request, response){ //root dir
    response.send("Root!!");
});


app.get("/getData", function(req, response){
	console.log(req.query.url);
	var url = req.query.url;
	// Reuqests the NYTimes data
	request('http://api.nytimes.com/svc/community/v3/user-content/url.json?api-key=5a201de4998d3b4049fd577cce90db66:1:71926099&url='+url, function (error, res, data) {
		if (!error && res.statusCode == 200) {


			data = JSON.parse(data);

//library from: https://github.com/thisandagain/sentiment

			// iterate over each comment
			for (var i = 0; i < data.results.comments.length; i++) {

// // check the sentiment of the comment
				var result = sentiment(body, {
    			'illegal': 500,
    			'alien': -500,
    			'steal': -500,
    			'criminals': -500,
    			'burden': -500,
    			'illegals': -500,
				});

				// get the comment body
				var comment = data.results.comments[i];
				var body = comment.commentBody;


				var s = sentiment(body);
				comment["sentiment"] = s;
			}
			response.jsonp(data);
		}
		else {
			response.send("Something broke! :(");
		}
		
	});

});

app.listen(port, host);






