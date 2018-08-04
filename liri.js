
require("dotenv").config();

var Twitter = require('twitter');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userProgram = process.argv[2];
var input = process.argv[3];

function doWhatItSays() {
    if (userProgram === "do-what-it-says") {
        fs.readFile('random.txt', 'utf8', function (err, data) {
            if (err) throw err;
            var dataArray = (data.split(","));
            userProgram = dataArray[0];
            input = dataArray[1];
            myTweets();
            spotifySong();
            movieThis();
        });
    }
}

function movieThis() {
    var input = process.argv[3];
    if (userProgram === "movie-this") {
        if (input === undefined) {
            var input = 'Mr Nobody'
        }
        request('http://www.omdbapi.com/?apikey=trilogy&s=' + input + '&type=movie', function (error, response, body) {
            //   console.log('error:', error); // Print the error if one occurred
            //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            var response2 = (JSON.parse(body)); // Print the HTML for the Google homepage.
            var IMDB = response2.Search[0].imdbID;

            function secondRequest() {
                request('http://www.omdbapi.com/?apikey=trilogy&i=' + IMDB + '&type=movie', function (error, response, body) {
                    var response3 = (JSON.parse(body)); // Print the HTML for the Google homepage.
                    console.log("Title: " + response3.Title);
                    console.log("Year: " + response3.Year);
                    console.log("IMDB Rating: " + response3.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response3.Ratings[1].Value);
                    console.log("Country: " + response3.Country);
                    console.log("Language: " + response3.Language);
                    console.log("Plot: " + response3.Plot);
                    console.log("Actors: " + response3.Actors);
                });
            };
            secondRequest();
        });

    }
}


function spotifySong() {
    if (userProgram === "spotify-this-song") {
        spotify.search({ type: 'track', query: input }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 5));
            console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name, null, 5));
            console.log("Song Preview: " + JSON.stringify(data.tracks.items[0].external_urls.spotify, null, 5));
            console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 5));
        });
    }
}


function myTweets() {
    if (userProgram === "my-tweets") {
        var params = { screen_name: 'Student23817680' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                // console.log(JSON.stringify(tweets, null, 2));
                for (var i = 0; i < tweets.length; i++) {
                    console.log(JSON.stringify(tweets[i].created_at, null, 2))
                    console.log(JSON.stringify(tweets[i].text, null, 2));
                }
            }
        }
        )
    };
}

myTweets();
spotifySong();
movieThis();
doWhatItSays();
