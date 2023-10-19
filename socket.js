
const logger = require('./logger');
const WebSocket = require('ws');
const {WebSocketServer} = require("ws");
const config = require('./config/config');
const msgController = require('./controllers/socketMsgController');


const socketServer = new WebSocketServer({
  port: config.socketPort
})

let sockets = [];
socketServer.on('connection', function(socket) {
  logger.info(`new client conn`)
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {
    const rawMsg = msgController.msgHandler(socket, msg)
    sockets.forEach(s => s.send(rawMsg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    logger.info(`socket close`)
    sockets = sockets.filter(s => s !== socket);
  });
});

