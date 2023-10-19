/**
 * Useful helper functions for testing
 */
const User = require('../models/user');
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

var loginFunc = function(app,username,pass,callback) {
  var body={};
  request(app)
      .post('/v1/auth/local?auth=true')
      .send({ username: username, password: pass })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,resp){
//  	logger.info("api result: "+JSON.stringify(resp));
        if (err) {
          callback(err,null);
        }
        if (resp && resp.text) {
          var json = JSON.parse(resp.text);
          logger.info("api result: "+JSON.stringify(json));
//  		assert.ok(json,'unparsable json result');
//  		assert.ok(json.api_auth_token,'no auth token in response');
//  		assert.ok(json.user,'no user in response');
          body=json;
          callback(null,json.user.authToken,json.user);
        } else {
          assert.ok(false,'no response json for login');
//  		callback({error:{message:'http error:',code:response.statusCode}},null);
        }
      });

}

userUtil.login = loginFunc;

module.exports=userUtil;
