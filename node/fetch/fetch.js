var matches = require('livesoccertv-parser')
var request = require('request')
var TimerJob = require('timer-jobs')

const url = 'http://localhost:3000';
const jobTime = 120000;
const countryName = 'brazil';
const teamName = 'atletico-mineiro';

var lastGameStatus;

var fetchGoals = new TimerJob({interval : jobTime}, function(done) {
    return matches(countryName, teamName)
        .then(function(matches) { return checkGameStatus(matches); })
        .then(function(msg) {
            if (msg) {
                sendRequest(msg);
            }
        })
        .catch(function(err) { console.log("It failed: ", err); })
        .then(function() {
            console.log('...');
            done();
        })
});

fetchGoals.start();

function checkGameStatus(matches) {
    var response = null;

    if (matches && matches.length > 0) {
        var liveMatch = matches.find(function(match) { return match.live; });

        if (liveMatch && lastGameStatus != liveMatch.game) {
            lastGameStatus = liveMatch.game;

            response = configMessage(liveMatch);
        }
    }
    return response;
}

function sendRequest(msg) {
    return new Promise(function(resolve, reject) {
        request.post(url, {form : {team : 'galo', message : msg}},
                     function(error, response, body) {
                         if (!error && response.statusCode == 200) {
                             resolve("'success':true");
                         } else {
                             reject("'success':false");
                         }
                     });
    })
}

function configMessage(data) {
    var json = {
        'title' : data.game,
        'body' : data.competition,
        'icon' : 'images/ball.png'
    };

    return JSON.stringify(json);
}

var fetch = {};
fetch.matches = matches;
fetch.configMessage = configMessage;
fetch.checkGameStatus = checkGameStatus;
fetch.sendRequest = sendRequest;
module.exports = fetch;
