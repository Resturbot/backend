const express       = require('express');
const fs            = require("fs-extra");
const url           = require('url');
const validator     = require('express-validator');
const restler       = require('restler');

const messenger_config = require('./messenger_config.js');
const message_handler = require('./message_handler.js');

const database  = require('./menu_lib/db.js');

const app    = express();
const port   = process.env.PORT || 8080;
/* Get an instance of the express Router */
const router = express.Router();

app.use(validator([]));
app.use('', router);

database.connect();

// Sign-up a restaurant
router.get('/api/signup', (req, res) => {
	// Pull facebook page token
	const pageToken = ;

	// Pull facebook page id
	const pageID = ;

	// Pull facebook page name
	const pageName = ;

	// Make call to get menu data

	// Add restaraunt data to backend/config
	messenger_config.add(pageID, pageName, pageToken);
}

// Handle incoming message
router.post('/resaurant/*', (req, res) => {
	// Pull facebook page id from query param
	const pageID = ;

	var events = req.body.entry[0].messaging;

	message_handler.handle(events);
    
    res.sendStatus(200);
}

const server = app.listen(port, function() {
  let host = server.address().address
  let port = server.address().port
  console.log("Listening at http://%s:%s\n", host, port)
});