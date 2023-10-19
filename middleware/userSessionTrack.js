const createError = require('http-errors');
const logger = require('../logger');
const User = require('../models/usermongo');
const sessionParser = require('./sessionParser')
const url = require('url');
const userSessionTrack = {};


userSessionTrack.findSessionUser = async (req, res, next) => {
  sessionParser.parse(req);
  req.user=null
  logger.info(`user agent: ${req.useragent.browser}`)
  
  // TODO cleanup
  // shim for dev work to bypass auth by forcing users
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
    // there is an existing session
    const updateUser = await User.findByUserId(req.session.user._id.toString());
    if (!updateUser) {
      // have a session, but can't find the user?
      // ? should clear session then redir to login ?
      // logger.info("error finding session user ");
      next(createError(404, 'error finding session user'))
    } else {
      req.user=req.session.user=updateUser;
      next();
    }
  } else {
    logger.info("no session user");
    let referer = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl
    });
    res.redirect('/auth?loc='+encodeURIComponent(referer))
  }
}
module.exports = userSessionTrack;

const resetSessionUser = function(req) {
  req.session=null;
  req.user=null;
  req.token=null;
}