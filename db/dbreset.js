//
// convenience script for setting up db on dev box
//
// run via 'node db/dbreset.js from project dir
//
const logger = require('../logger');
const db = require('./dbSetupUtils');
var mongoose = require('mongoose');

Promise.resolve(db.resetDb()).then(a => {
  logger.info(`done`)
  process.exit(0)
})