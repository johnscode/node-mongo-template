/**
 *
 */
var env = process.env.NODE_ENV || "test";
var config = require(__dirname + '/../config/config');

const logger = require('./test-logger');

const debug = require('debug')('vchat-test');
const request = require('supertest');
const assert = require('assert');
const userutil = require('./userutil');
const User = require('../models/usermongo');

describe('user model,',function() {

  before(async function () {
    await userutil.resetUsers()
  })
  beforeEach(function(done) {
    done();
  });

  it('dummy', async function () {
    assert.ok(true);
  });

  it('find by username',async () => {
    u=await User.findByUsername('god');
     logger.info(`dict = ${JSON.stringify(userutil.userDict,null,2)}`)
    assert.equal(u.username,userutil.userDict['god'].username);
    assert.equal(u.apikey,userutil.userDict['god'].apikey);
  });

  after(function(done) {
    // runs after all tests in this block
    done();
  });
})



