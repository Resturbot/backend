'use strict';

const database = require('../db_lib/db.js');

module.exports = {
	actions: {
		send() {

		},

		getMenu({context, entities}) {
		    return db.getMenu(context.pageID).then((result) => {
		    	return result;
		    });
		},
	}
}