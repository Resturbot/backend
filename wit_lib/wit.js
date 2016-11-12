'use strict';

const Wit = require('node-wit').Wit;
const Logger = require('node-wit').Logger;
const levels = require('node-wit').logLevels;
const logger = new Logger(levels.DEBUG);
// const config = require('./wit_config.js');
// const token = config.wit_token;
const token = 1234356; // temporary random token to avoid using config
const context = {};

const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
  },
  error(sessionId, context, err) {
    console.log(err.message);
  },
};

const client = new Wit(token, actions, logger);

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