'use strict'
var mongo_host, mongo_port

if (process.env.MONGO_PORT_27017_TCP_ADDR) {
	mongo_host = process.env.MONGO_PORT_27017_TCP_ADDR;
	mongo_port = process.env.MONGO_PORT_27017_TCP_PORT;
} else {
	mongo_host = "localhost";
	mongo_port = "27017";
}

module.exports = {
	'mongo_host' : mongo_host,
	'mongo_port' : mongo_port
}