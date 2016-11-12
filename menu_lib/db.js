'use strict'

const mongoose = require('mongoose');
const Db       = require('mongodb').Db;
const Server   = require('mongodb').Server;

const config   = require('./db_config.js');

const DBcollection = "restaurants";
let mongoServer, mongoPort;

const connect = () => {
    let options = {
        db: {
            native_parser: true
        }
    }
    mongoServer = "mongodb://" + config.mongo_host + ":" + config.mongo_port + "/restaurants";
    mongoPort = config. mongoPort;
    
    mongoose.connect(mongoServer, options);
    console.log('Connected to mongoDB: ', mongoServer);
}

const updateCache = (pageID, data) => {
    return new Promise((resolve, reject) => {
        // Establish connection to db
        let updateData = data;
        let d = new Date();
        updateData.updated = d;
        updateData.pageID = pageID;

        let db = new Db('restaurants', new Server(config.mongo_host, config.mongo_port));
        db.open((err, db) => {
            let collection = db.collection(DBcollection);
            // create record, or insert record if it does not exist
            console.log(collection);
            collection.updateOne({pageID: pageID}, updateData, {upsert:true, w: 1}, 
                (err, records) => {
                    if (err) {
                      db.close();
                      reject(err);
                    } else {
                      db.close();
                      resolve();
                    }
            });
                      
        });
    })
}

const getOne = (pageID) => {
    return new Promise((resolve, reject) => {
        // Establish connection to db
        let db = new Db('restaurants', new Server(config.mongo_host, config.mongo_port));
        db.open((err, db) => {
            let collection = db.collection(DBcollection);
            collection.findOne({pageID:pageID}, {'pageID': 0, '_id':0}, 
                (err, records) => {
                    if (err) {
                        db.close();
                        reject(err);
                    } else {
                        db.close();
                        resolve(records);
                    }
            });                      
        });
    })
}

const getAll = (page, size) => {
    return new Promise((resolve, reject) => {
        // Establish connection to db
        let db = new Db('test', new Server(config.mongo_host, config.mongo_port));
        db.open((err, db) => {
            let collection = db.collection(DBcollection);

            if (err) {
                reject(dbConnectError);
            } else {
                let dbpage = page - 1; // Default page is 1,but query to db starts at 0
                let skip = dbpage * size;
                let limit = size;
                collection.find({}, {'_id':0, 'updated':0}).skip(skip).limit(limit).toArray(
                    (err, docs) => {
                        if (!err) {

                            let totalItems, totalPages;
                            let returnDict;
                            // Perform a total count command
                            collection.count((err, count) => {
                                totalItems = count;
                                totalPages = Math.ceil(totalItems / size);

                                returnDict = {
                                    page: page,
                                    size: docs.length,
                                    more: (page < totalPages) ? true : false,
                                    from: ((page - 1) * size),
                                    totalPages: totalPages,
                                    total: totalItems,
                                    data: docs
                                };

                                resolve(returnDict);
                                db.close();
                            });
                        } else {
                            db.close();
                            console.log("Get all error: ", err)
                            reject(err);
                        }
                });
            }
        });
    })
}

const listRestaurants = () => {
    return new Promise(function(resolve, reject) {
        // Establish connection to db
        let db = new Db('test', new Server(config.mongo_host, config.mongo_port));
        db.open(function(err, db) {
            var collection = db.collection(DBcollection);

            if (err) {
                console.log("Couldnt actually open db");
                reject(err);
            } else {
                // Peform a simple find and return all the documents
                collection.find({}, {'pageID': 1, '_id':0}).toArray(
                    (err, docs) => {
                      if (!err) {
                          db.close();
                          resolve(docs);
                      } else {
                          db.close();
                          reject(err);
                      }
                });
            }
        });
    })
}


module.exports = {
    getOne: getOne,
    updateCache: updateCache,
    getAll: getAll,
    listRestaurants: listRestaurants,
    connect: connect
}