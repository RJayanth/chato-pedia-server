const chatHandlers = require('./chatHandlers');
const userHandlers = require('./userHandlers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    chatHandlers(io, socket);
    userHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
