const config = require('../config/config');
const strings = require('../strings')
const User = require("../models/usermongo");
const createError = require('http-errors');

module.exports.loginFormController = function(req, res, next) {
    var loc = '/'
    if (!req.query.loc) {
        loc = req.query.loc.toString()
    }
    res.render('login',
        {
            title: strings.getString("site-title") ,
            user: '',
            loc: loc
        }
    );
}

module.exports.loginPostController = async function(req, res, next) {
    let body = req.body
    const user = await User.findByUsername(body.username);
    if (!user) {
        next(createError(404, `could not find user ${body.username}`));
        return
    }
    if (!user.verifyPassword(body.password)) {
        next(createError(401, `incorrect password for user ${body.username}`));
        return
    }
    req.session.user = user
    res.redirect(req.query.loc)
}
