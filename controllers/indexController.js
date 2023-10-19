
const config = require('../config/config');
const strings = require('../strings')

module.exports.indexController = function(req, res, next) {
  res.render('index',
      {
        title: strings.getString("site-title") ,
        user: req.user.first_name,
        socketPort: config.socketPort
      }
  );
}
