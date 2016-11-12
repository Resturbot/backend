'use strict'
let mongo_host, mongo_port, mongo_address;

if (process.env.MONGOLAB_ROSE_URI) {
	mongo_address = process.env.MONGOLAB_ROSE_URI;
	let doubleSlashIndex = mongo_address.indexOf("//") + 2;
	let colonIndex = mongo_address.indexOf(":", mongo_address.indexOf(":") + 1);

	mongo_host = mongo_address.substring(doubleSlashIndex,colonIndex);
	mongo_port = mongo_address.substring(colonIndex+1);
} else {
	mongo_host = "mongodb://localhost";
	mongo_port = "27017";
	mongo_address = mongo_host + ":" + mongo_port;
}

module.exports = {
	'mongo_address': mongo_address,
	'mongo_host': mongo_host,
	'mongo_port': mongo_port
}