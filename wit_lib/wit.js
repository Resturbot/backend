'use strict';

const Wit = require('node-wit').Wit;
const Logger = require('node-wit').Logger;
const levels = require('node-wit').logLevels;
const logger = new Logger(levels.DEBUG);
const token = process.env.WIT_TOKEN;
const actions = require('./wit_actions.js').actions;

const client = new Wit(token, actions, logger);

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};
const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

const message_wit_get_data  = (message) => {
    client.message(message, {}, (error, data) => {
        if (error) {
          console.log('Oops! Got an error: ' + error);
          return "Try a different question."
        } else {
          console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
          return data;
        }
    });
}

module.exports = {
  wit : client,
  botMessage : message_wit_get_data
}