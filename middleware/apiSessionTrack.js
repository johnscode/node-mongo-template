const createError = require('http-errors');
const logger = require('../logger');
const User = require('../models/usermongo');
const session = require('express-session');

const userSessionTrack = {};

const sessionParser = session({
  saveUninitialized: false,
  secret: 'thequickbrownfox',
  resave: false
});

userSessionTrack.findSessionUser = async (req, res, next) => {
  sessionParser(req, {}, () => {
    logger.info(`parsed session ${JSON.stringify(req.session)}`)
  });
  req.user=null
  req.token=null
  var token = req.headers.token;
  if (!token) token = req.query.token
  logger.info(`user agent: ${req.useragent.browser}`)
  // shim for dev work to force users
  if (req.useragent.browser.match(/safari/gi)) {
    logger.info(`safari`);
    req.user = await User.findByUsername('johnscode');
    req.session.user = req.user
  } else if (req.useragent.browser.match(/firefox/gi)||req.useragent.browser.match(/chrome/gi)) {
    logger.info(`${req.useragent.browser}`);
    req.user = await User.findByUsername('god');
    req.session.user = req.user
  }
  // end dev shim
  logger.info(`session: ${JSON.stringify(req.session)}`)
  if (req.session && req.session.user) {
    req.token=token
    const updateUser = await User.findByUserId(req.session.user.id.toString());
    if (!updateUser) {
      logger.info("error finding session user ");
      next(createError(404, 'error finding session user'))
    } else {
      req.user=req.session.user=updateUser;
    }
  } else {
    logger.info("no session user");
    next(createError(401, 'no god user.'))
    return
  }
  next();
}
module.exports = userSessionTrack;
module.exports.sessionParser = sessionParser;

const resetSessionUser = function(req) {
  req.session=null;
  req.user=null;
  req.token=null;
}