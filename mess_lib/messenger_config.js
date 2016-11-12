'use strict';

let pages = {
	
}

const add = (pageID, pageName, pageAccessToken) => {
	pages[pageID] = {
		name: pageName,
		access_token : pageAccessToken
	}
}

module.exports = {
	add : add
}