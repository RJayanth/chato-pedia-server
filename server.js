const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const config = require('./config.js');
const server = http.createServer(app);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

server.listen(config.PORT, () => {
  console.log(`NODE_ENV=${config.NODE_ENV}`);
  console.log(`server listening at http://${config.HOST}:${config.PORT}`);
});

const io = require('socket.io')(server, {
  ...config.SOCKET_CONFIG,
  cors: {
    cors: {
      origin: config.CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
    }
  },
});

io.use((socket, next) => {
  const userDetails = socket.handshake.auth.userDetails;
  socket.userDetails = { ...userDetails, id: socket.id };
  next();
});

io.on('connection', (socket) => {
  console.log('Active sockets ', io.engine.clientsCount);
  console.log('user connected ', socket.id, socket.userDetails.userName);

  socket.emit('connection successful', socket.userDetails);

  // fetch existing users
  let users = [];
  for (let [id, sckt] of io.of('/').sockets) {
    console.log('id, socket user Details ---', id, sckt.userDetails);
    console.log('socket details', socket.userDetails);
    if (id !== socket.id) {
      users.push(sckt.userDetails);
    }
  }

  // send total users list to the newly connected user
  console.log('usersList ', users);
  socket.emit('initial users list', users);

  // notify existing users about new user
  socket.broadcast.emit('new user', socket.userDetails);

  // forward the private message to the right recipient
  socket.on('private message', ({ content, sendToId }) => {
    socket.to(sendToId).emit('incoming private message', {
      content,
      fromId: socket.id,
    });
  });

  socket.on('typing', (payload) => {
    console.log('typing event recvieved in server', payload);
    socket
      .to(payload.sendToId)
      .emit('user typing', { sentFromId: socket.userDetails.id });
  });

  // notify users upon disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    console.log('Active sockets ', io.engine.clientsCount);
    socket.broadcast.emit('user disconnected', socket.id);
  });
});
