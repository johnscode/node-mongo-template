
const logger = require('../logger');
const config = require('../config/config');

module.exports.msgHandler = function(socket, msg) {
  const mm = JSON.parse(msg)
  const msgAsStr = JSON.stringify(mm)
  logger.info(`socket msg: ${msgAsStr}`)
  switch (mm.type) {
    case "message":
      logger.info(`message received: ${mm.message}`);
      break;
    case "command":
      logger.info(`command received: ${mm.command}`);
      break;
  }
  return msgAsStr
}