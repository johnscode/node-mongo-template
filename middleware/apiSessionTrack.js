const createError = require('http-errors');
const logger = require('../logger');
const User = require('../models/usermongo');
const sessionParser = require('./sessionParser')

const apiSessionTrack = {};

apiSessionTrack.findSessionUser = async (req, res, next) => {
  sessionParser.parse(req);
  req.user=null
  req.token=null
  var token = req.headers.token;
  if (!token) token = req.query.token
  logger.info(`session: ${JSON.stringify(req.session)}`)
  if (!token) {
    let msg = 'no api key given.'
    logger.info(msg);
    next(createError(401, msg))
    return
  }
  const apiUser = await User.findByApiKey(token.toString())
  if (!apiUser) {
    let msg = 'unrecognized api key.'
    logger.info(msg);
    next(createError(401, msg))
    return
  }
  req.token=token
  req.user=req.session.user=apiUser;
  next();
}
module.exports = apiSessionTrack;
module.exports.sessionParser = sessionParser;

const resetSessionUser = function(req) {
  req.session=null;
  req.user=null;
  req.token=null;
}