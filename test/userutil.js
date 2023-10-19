/**
 * Useful helper functions for testing
 */
const User = require('../models/usermongo');
const logger = require('./test-logger');
const async = require('async');
const request = require('supertest');
const bluebird = require('bluebird');

const userUtil = {};

userUtil.userDict = {}

const initialUsers = () => {
  return [
    new User({
      first_name: 'admin',
      last_name: 'god',
      username: 'god',
      email: 'admin@johnscode.com',
      apikey: 'babacaca4242',
      encryptedPass: 'j'   // see  preSave method in ../models/user.js, it encrypts pass before db insert
    }),
    new User( {
      encryptedPass : "j",
      lastLogin : new Date("2015-09-29T02:04:55.622Z"),
      email : "code@johnscode.com",
      first_name : "John's",
      last_name : "Code",
      username : "johnscode",
      apikey: 'code',
    }),
    new User( {
      encryptedPass : "j",
      lastLogin : new Date("2015-09-29T02:04:55.622Z"),
      email : "dev@johnscode.com",
      first_name : "dev",
      last_name : "Code",
      username : "j",
      apikey: 'j',
    }),
  ];}

const initUsersFunc = async function() {
  logger.info("initUsersFunc")
  var promis = initialUsers().map(async function (u) {
    userUtil.userDict[u.username] = await u.save();
    return userUtil.userDict[u.username];
  });
  logger.info(`initUsersFunc done`)
  return promis
};

userUtil.setupTestUsers = initUsersFunc;

const deleteUsersFunc = async function() {
  logger.info(`deleteUsersFunc  `)
  userUtil.userDict={}
  var q = await User.deleteMany({})
  logger.info(`deleteUsersFunc done  ${JSON.stringify(q)}`)
}
userUtil.clearUsers = deleteUsersFunc;

userUtil.resetUsers = async () => {
  await deleteUsersFunc();
  await initUsersFunc();
}

module.exports=userUtil;
