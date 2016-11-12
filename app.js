'use strict';

const express       = require('express');
const validator  = require('express-validator');
const bodyParser = require('body-parser');
const url           = require('url');
const multiparty = require('multiparty');
const util = require('util');
const messenger_config = require('./mess_lib/messenger_config.js');
const message_handler = require('./mess_lib/message_handler.js');

const database  = require('./menu_lib/db.js');
const menu_converter = require('./menu_lib/menu_converter.js');

const app    = express();
const port   = process.env.PORT || 8080;
/* Get an instance of the express Router */
const router = express.Router();

app.use(validator([]));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('', router);

database.connect();

// Test null endpoint
router.get('/', (req, res) => {
	console.log("Succesful endpoint test");
	res.sendStatus(200);
})

// Sign-up a restaurant
router.post('/api/signup', (req, res) => {
	  // parse a file upload
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
    	const imagePath = files.upload[0].path;
    	const menuData = menu_converter.convert(imagePath);

    	const pageID = fields.pageID;
    	const pageToken = fields.pageToken[0];
    	const pageName = fields.pageName[0];

    	// Add restaraunt data to backend/config and to database
		messenger_config.add(pageID, pageName, pageToken);

		const data = {
			pageName: pageName,
			pageToken: pageToken,
			menuData: menuData
		};

		database.updateCache(pageID, data).then(
			(result) => {
		      	res.writeHead(200, {'content-type': 'text/plain'});
		      	console.log(`Stored ${pageName}`);
		      	res.write('Success:\n\n');
	     		res.end();
			}, 
			(err) => {
				console.log("Failed to store restaurant");
				console.log(err);
				res.sendStatus(500);
	     		res.end();	
		});


      // res.end(util.inspect({fields: fields, files: files}));
    });
});

// Handle facebook's 'challenge' that that bot is legit
router.get('/restaurant/:page_id/menu', function (req, res) {
	database.getAll(1, 10).then((result) => {
		const data = result;
		console.log(data);
	}, (err) => {
		console.log(err);
	});

	res.sendStatus(200);
});

// Handle facebook's 'challenge' that that bot is legit
router.get('/restaurant/:page_id/challenge', function (req, res) {
	if (req.query['hub.verify_token'] === 'req.query') {
		console.log(req.query);
      res.send(req.query['hub.challenge']);
   } else {
      res.send('Error, wrong validation token');    
   }
  return;
});

// Handle incoming message
router.post('/resaurant/:page_id', (req, res) => {
	// Pull facebook page id from query param
	const pageID = req.params.id;

	// If pageID is null, ignore the request. Restaurant isn't signed up
	if(pageID == null) {
		res.sendStatus(500);
		return;
	}

	var events = req.body.entry[0].messaging;
	message_handler.handle(events);
    
    res.sendStatus(200);
});

const server = app.listen(port, function() {
  let host = server.address().address
  let port = server.address().port
  console.log("Listening at http://%s:%s\n", host, port)
});