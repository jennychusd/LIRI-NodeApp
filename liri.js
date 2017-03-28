var twitter = require('twitter');
var client = require('./keys.js');
console.log(client);
var fs = require('fs');

var nodeArgs = process.argv;
var userCommand = nodeArgs[2];
var userInput = nodeArgs.slice(3);

function twitterCall() {
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log(tweets);
		}
	})
}

function spotifyCall(input) {

}

function omdbCall(input) {

}

function doWhatItSays() {
	
}

if (userCommand === "my-tweets") {
	twitterCall();
} else if (userCommand === "spotify-this-song") {
	spotifyCall(input);
} else if (userCommand === "movie-this") {
	omdbCall(input);
} else if (userCommand === "do-what-it-says") {
	doWhatItSays()l
} else {
	console.log("choose from valid commands: my-tweets, spotify-this-song, movie-this or do-what-it-says")
}