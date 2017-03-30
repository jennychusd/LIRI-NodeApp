var client = require('./keys.js');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var nodeArgs = process.argv;
var userCommand = nodeArgs[2];
var userInput = nodeArgs.slice(3);

function commandRouter(userInput) {
	switch(userCommand) {
		case 'my-tweets':
			twitterCall();
			break;
		case 'spotify-this-song':
			if (userInput == "") {
				userInput = ["The", "Sign"];
			}
			spotifyCall(userInput);
			break;
		case 'movie-this':
			if (userInput == "") {
				userInput = "Mr. Nobody";
			}
			omdbCall(userInput);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
			console.log("choose from valid commands: my-tweets, spotify-this-song, movie-this or do-what-it-says")
	}
}

commandRouter(userInput);

function twitterCall() {
	var params = {screen_name: 'jennychuily'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i=0; i<20; i++) {
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
				console.log("---------------");
			}
		}
	})
	logFile();
}

function spotifyCall(userInput) {
	spotify.search({
		type: 'track',
		query: userInput,
	},
		function (err, data) {
			if (err) {
				console.log('Error occurred: ' + err);
				return;
			}
			console.log("Artist: " + data.tracks.items[1].artists[0].name);
			console.log("Name: " + data.tracks.items[0].name);
			console.log("Preview link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[1].album.name);
		}
	)
	logFile();
}

function omdbCall(userInput) {
	console.log(userInput);
	request('http://www.omdbapi.com/?t=' + userInput + '&y=&plot=short&r=json&tomatoes=true'), function(error, response, body) {
		if (!error && response === 200) {
			console.log(JSON.parse(body).Title);
			console.log(JSON.parse(body).Year);
		 	console.log(JSON.parse(body).imdbRating);
		 	console.log(JSON.parse(body).Country);
		 	console.log(JSON.parse(body).Language);
		 	console.log(JSON.parse(body).Plot);
		 	console.log(JSON.parse(body).Actors);
		 	console.log(JSON.parse(body).tomatoConsensus);
		 	console.log(JSON.parse(body).tomatoURL);
		}
	}
}

function doWhatItSays() {
	fs.readFile('random.txt', 'utf-8', function(error, data) {
		var input = data.split(',');
		userCommand = input[0];
		userInput = input[1];
		commandRouter(userInput);
	})
	logFile();
}

function logFile() {
	userInput = userInput.replace(',', ' ');
	var logEntry = userCommand + ' ' + userInput + '\n';
	fs.appendFile('log.txt', logEntry, function(err) {
		if (err) {
			console.log(err)
		}
		console.log('log was updated')
	})
}