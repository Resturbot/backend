'use strict';

const request = require('request');
const database  = require('../db_lib/db.js');
const MESSAGE_TYPES = require('./message_types.js');

//  Simply echo messages for now
const handle = (events, pageID) => {
	for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
}

// TODO switch out hardcoded access token with config.get[pageID]
const startMessage = (message, pageID) => {
    let access_token = database.getOne(pageID).then()
    request({
        url: 'https://graph.facebook.com/v2.6/240673306291555/thread_settings',
        qs: {access_token: 'EAAQJ4lDZCkMgBACwE8DAaAexKjyYGgMLb5HtRdafpQK7jaUWkYKA6DlrYc3PiH7Q8hQiRe0aLodPvSb18zqsMwQGRQNUdTBZCOjjeQMcydsBkuZBvpTUWjCPZCcZBKkK1rAeYwCzBE04P6J5AQ2Wi2Nr73DBUzibKiHCd6CHJTgZDZD'},
        method: 'POST',
        json: {
            message: message,
        }
    }, (error, response, body) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// TODO switch out process.env.PAGE_ACCESS_TOKEN with config.get[pageID]
const sendMessage = (recipientId, message, pageID) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAQJ4lDZCkMgBACwE8DAaAexKjyYGgMLb5HtRdafpQK7jaUWkYKA6DlrYc3PiH7Q8hQiRe0aLodPvSb18zqsMwQGRQNUdTBZCOjjeQMcydsBkuZBvpTUWjCPZCcZBKkK1rAeYwCzBE04P6J5AQ2Wi2Nr73DBUzibKiHCd6CHJTgZDZD'},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, (error, response, body) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

module.exports = {
    startMessage: startMessage,
    sendMessage: sendMessage,
	handle: handle
}