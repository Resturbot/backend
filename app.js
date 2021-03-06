'use strict';

const express       = require('express');
const validator  = require('express-validator');
const bodyParser = require('body-parser');
const url           = require('url');
const multiparty = require('multiparty');
const util = require('util');
const fs = require('fs');

const messenger_config = require('./mess_lib/messenger_config.js');
const message_handler = require('./mess_lib/message_handler.js');

const database  = require('./db_lib/db.js');

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
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
    	console.log(files);
    	console.log(fields);

    	const imagePath = files.datafile[0].path;
    	const menuData = menu_converter.convert(imagePath);

    	const pageID = fields.pageID[0];
    	const pageToken = fields.pageToken[0];
    	const pageName = fields.pageName[0];

    	// Add restaraunt data to backend/config and to database
		messenger_config.add(pageID, pageName, pageToken);

		const data = {
			pageName: pageName,
			pageToken: pageToken,
			menuData: menuData
		};

		database.updateData(pageID, data).then(
			(result) => {
				fs.readFile('./signup-return.html',"utf-8", function (err, html) {
				    if (err) {
				        throw err; 
				    }
				    console.log(html);
				    
				    const webhook = `https://resturbot.herokuapp.com/restaurant/${pageToken}`;
				    const verify_token = `resturbot-${pageID}`;
				    html = html.replace('${ENTER HERE}', `Webhook: ${webhook}\n Verfy Token: ${verify_token}`);
				
				    res.writeHead(200, {'content-type': 'text/html'});
			      	console.log(`Stored ${pageName}`);
			      	res.write(html);
		     		res.end();
				});
			}, 
			(err) => {
				console.log("Failed to store restaurant");
				console.log(err);
				res.sendStatus(500);
	     		res.end();	
		});
    });
});

// Handle facebook's 'verification' that that bot is legit
router.get('/restaurant/:page_id/', (req, res) => {
	const pageID = req.params.page_id;
	if (req.query['hub.verify_token'] === `resturbot-${pageID}`) {
		// console.log(req.query);
      res.send(req.query['hub.challenge']);
   } else {
      res.send('Error, wrong validation token');    
   }
});

// Handle incoming messagea
router.post('/restaurant/:page_id', (req, res) => {
	// Pull facebook page id from query param
	const pageID = req.params.page_id;

	// If pageID is null, ignore the request. Restaurant isn't signed up
	if(pageID == null) {
		res.sendStatus(201);
		res.end();
	}

	var events = req.body.entry[0].messaging;
	console.log();
	console.log(events);
	console.log();

	message_handler.handle(events, pageID);
    
    res.end();
});

const server = app.listen(port, () => {
  let host = server.address().address
  let port = server.address().port
  console.log("Listening at http://%s:%s\n", host, port)
});