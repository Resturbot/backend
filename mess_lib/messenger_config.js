'use strict';

let pages = {
	
}

const add = (pageID, pageName, pageAccessToken) => {
	pages[pageID] = {
		name: pageName,
		access_token : pageAccessToken
	}
}

const get = (pageID) => {
	return pages[pageID];
}

module.exports = {
	add : add,
	get : get
}