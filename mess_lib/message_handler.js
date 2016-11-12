'use strict';

const request = require('request');
const MESSAGE_TYPES = require('./message_types.js');

// Incoming 
const handle = (events) => {
	for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	// console.log(botMessage);

        	// Handle message depending on what type of message it is.
        	// TODO: finish this
        	switch() {
        		default: 

        		wit.botMessage(event.message);
        	}
            messenger.sendMessage(event.sender.id, {text: `Location is ${botMessage}`});
        }
    }
}

// TODO switch out process.env.PAGE_ACCESS_TOKEN with config.get[pageID]
const startMessage = (message, pageID) => {
    request({
        url: 'https://graph.facebook.com/v2.6/240673306291555/thread_settings',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            message: message,
        }
    }, function(error, response, body) {
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
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

module.exports = {
    startMessage: startMessage,
    sendMessage: sendMessage
}

module.exports = {
	handle: handle
}