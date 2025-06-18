const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '192.168.31.126',
  PORT: process.env.PORT || 3001,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SOCKET_CONFIG: {
    transports: ['websocket'], // force websocket for better stability
    pingInterval: 25000, // how often the server sends a ping (default is 25000ms)
    pingTimeout: 120000, // how long to wait for pong before disconnect (increase this 2 mins)
  }
};
