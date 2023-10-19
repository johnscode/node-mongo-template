const logger = require('../logger');
const session = require('express-session');

const sessionParser = session({
    saveUninitialized: false,
    secret: 'thequickbrownfox',
    resave: false
});

const parseSession = function (req) {
    sessionParser(req, {}, () => {
        logger.debug(`parsed session ${JSON.stringify(req.session)}`)
    });
}

module.exports.sessionParser = sessionParser
module.exports.parse = parseSession
