'use strict';

const sportsLive = require('sports-live');
const stringScore = require('string-score');
const dynamodb = require('../lib/dynamodb');
const underscore = require('underscore');

const TEAM = 'HIFK Helsinki';
const TEAM2 = 'IFK Helsinki';
const SPORT = 'hockey';
const DISTANCE = 0.5;
const MINUTESTOTRACK = 60 * 24;


async function handler() {
  try {
    await fetchGoals();
  } catch (error) {
    console.log(`Error when fetching goals: ${JSON.stringify(error)}`);
    throw error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({message: `Operation concluded!`}),
  };
};


async function fetchGoals() {
  const results = await runApi();
  if (results) {
    console.log(results);
  } else {
    console.log('no results');
  }
  const result = filterResult(results);

  if (result) {
    const events = await dynamodb.getEvents(MINUTESTOTRACK);

    if (isNewEvent(events, result)) {
      await dynamodb.saveEvent(result);
    }
  }
}

function isNewEvent(events, event) {
  for (let i = 0; i < events.length; i++) {
    if (underscore.isEqual(events[i], event)) {
      return false;
    }
  };

  return true;
}

function filterResult(matches) {
  for (let i = 0; i < matches.length; i++) {
    if (checkTeam(matches[i].team1) || checkTeam(matches[i].team2)) {
      return matches[i];
    }
  }
}

function runApi() {
  return new Promise((resolve, reject) => {
    sportsLive.getAllMatches(SPORT, function(err, matches) {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

function checkTeam(team) {
  let response = false;
  if ((typeof team == 'string') && (stringScore(TEAM, team, DISTANCE) > DISTANCE || stringScore(TEAM2, team, DISTANCE) > DISTANCE)) {
    response = true;
  }

  return response;
}

module.exports = {
  handler,
  runApi,
  checkTeam,
};
