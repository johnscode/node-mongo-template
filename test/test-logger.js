var env = process.env.NODE_ENV || "test";
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('log', env + '.log') })
  ]
});
// logger.handleExceptions(new Logger.transports.File({ filename: 'log/exceptions.log' }));

const elogger = winston.createLogger({
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('log', 'express_'+env+'.log') })
  ]
});
// elogger.handleExceptions(new Logger.transports.File({ filename: 'log/express_exceptions.log' }));
// Logger.remove(Logger.transports.Console);

module.exports=logger;
module.exports.expressLogger=elogger;