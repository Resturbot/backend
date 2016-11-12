const express       = require('express');
const fs            = require("fs-extra");
const url           = require('url');
const validator     = require('express-validator');
const restler       = require('restler');

const config        = require('./config.js');
const database      = require('./lib/db-helper.js');
const ph            = require('./lib/phantom-helper.js');

const app    = express();
const port   = process.env.PORT || 8080;
/* Get an instance of the express Router */
const router = express.Router();

app.use(validator([]));
app.use('', router);

database.connect();

router.get('/api/signup', (req, res) => {
	// Pull facebook page token

	// Pull facebook page id

	// Make call to get menu data

	// Add restaraunt data to backend
	
}