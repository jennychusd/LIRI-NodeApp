var client = require('./keys.js');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var userCommand = process.argv[2];
var userInput = process.argv.slice(3);

function commandRouter(userCommand) {
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

commandRouter(userCommand);

// call twitter and display the last 20 tweets with created times
function twitterCall() {
	var params = {screen_name: 'jennychuily'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log(error);
		} else {
			for (var i=0; i<20; i++) {
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
				console.log("------------------");
			}
		}
	})
	logFile();
}

// call spotify and display song's information
function spotifyCall(userInput) {
	spotify.search({
		type: 'track',
		query: userInput,
	},
		function (error, data) {
			if (error) {
				console.log('Error occurred: ' + error);
				return;
			} else {
				console.log("Artist: " + data.tracks.items[1].artists[0].name);
				console.log("Name: " + data.tracks.items[0].name);
				console.log("Preview link: " + data.tracks.items[0].preview_url);
				console.log("Album: " + data.tracks.items[1].album.name);
				console.log("------------------");
			}
		}
	)
	logFile();
}
// call omdb and display movie's information
function omdbCall(userInput) {
	request('http://www.omdbapi.com/?t=' + userInput + '&y=&plot=short&tomatoes=true&r=json', function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log('Title: ' + JSON.parse(body).Title);
			console.log('Year: ' + JSON.parse(body).Year);
		 	console.log('imdbRating: ' + JSON.parse(body).imdbRating);
		 	console.log('Country: ' + JSON.parse(body).Country);
		 	console.log('Language: ' + JSON.parse(body).Language);
		 	console.log('Plot: ' + JSON.parse(body).Plot);
		 	console.log('Actors: ' + JSON.parse(body).Actors);
		 	console.log('tomatoConsensus: ' + JSON.parse(body).tomatoConsensus);
		 	console.log('tomatoURL: ' + JSON.parse(body).tomatoURL);
		 	console.log("------------------");
			
			logFile();
		}
	})
	
}

// run the command and input in random.txt
function doWhatItSays() {
	fs.readFile('random.txt', 'utf-8', function(error, data) {
		var input = data.split(',');
		userCommand = input[0];
		userInput = input[1];
		commandRouter(userInput);
	})
	logFile();
}

// log each user command and input to log.txt
function logFile() {
	userInput = userInput.join(' '); // join the array with spaces
	var logEntry = userCommand + ' ' + userInput + '\n'; // append new command and input into log
	fs.appendFile('log.txt', logEntry, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('log was updated');
		}
	})
}