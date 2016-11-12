'use strict'

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Db       = require('mongodb').Db;
const Server   = require('mongodb').Server;

const config   = require('./db_config.js');

const DBcollection = "restaurants";
let mongoServer, mongoPort;

let db;

const connect = () => {
    mongodb.MongoClient.connect(config.mongo_address, (err, database) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Save database object from the callback for reuse.
        db = database;
    });

  console.log("Database connection ready: ", config.mongo_address);
}

const updateCache = (pageID, data) => {
    return new Promise((resolve, reject) => {
        // Establish connection to db
        let updateData = data;
        let d = new Date();
        updateData.updated = d;
        updateData.pageID = pageID;
        
        db.collection(DBcollection).updateOne({pageID: pageID}, updateData, {upsert:true, w: 1}, 
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
}

const getOne = (pageID) => {
    return new Promise((resolve, reject) => {
        db.collection.findOne({pageID:pageID}, {'pageID': 0, '_id':0}, 
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
}

const getAll = (page, size) => {
    return new Promise((resolve, reject) => {
        let dbpage = page - 1; // Default page is 1,but query to db starts at 0
        let skip = dbpage * size;
        let limit = size;
        db.collection(DBcollection).find({}, {'_id':0, 'updated':0}).skip(skip).limit(limit).toArray(
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
    });
}

const listRestaurants = () => {
    return new Promise(function(resolve, reject) {
        // Establish connection to db
        db.collection(DBcollection).find({}, {'pageID': 1, '_id':0}).toArray(
            (err, docs) => {
              if (!err) {
                  db.close();
                  resolve(docs);
              } else {
                  db.close();
                  reject(err);
              }
        });
    });
}


module.exports = {
    getOne: getOne,
    updateCache: updateCache,
    getAll: getAll,
    listRestaurants: listRestaurants,
    connect: connect
}