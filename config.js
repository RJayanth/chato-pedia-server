const dotenv = require('dotenv');
const path = require('path');

// Load the correct .env.* file
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${NODE_ENV}`) });
// Also load .env (base config) in all environments
dotenv.config({ path: path.resolve(__dirname, `.env`) });

module.exports = {
  NODE_ENV,
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3001,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SOCKET_CONFIG: {
    transports: ['websocket'],
    pingInterval: 25000,
    pingTimeout: 120000,
  }
};
