const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://192.168.0.105:3000',
  },
});

io.use((socket, next) => {
  const userDetails = socket.handshake.auth.userDetails;
  // console.log('in use handler ', userDetails);
  // if (userDetails.userName) {
  //   return next(new Error("invalid userName"));
  // }
  socket.userDetails = { ...userDetails, id: socket.id };
  next();
});

io.on('connection', (socket) => {
  console.log('Active sockets ', io.engine.clientsCount);
  console.log('user connected ', socket.id, socket.userDetails.userName);

  socket.emit('connection successful', socket.userDetails);

  // fetch existing users
  let users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push(socket.userDetails);
  }

  // send total users list to the newly connected user
  console.log('usersList ', users);
  socket.emit('users list', users);

  // notify existing users about new user
  socket.broadcast.emit('new user', socket.userDetails);

  // forward the private message to the right recipient
  socket.on('private message', ({ content, to }) => {
    socket.to(to).emit('private message', {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    console.log('Active sockets ', io.engine.clientsCount);
    socket.broadcast.emit(
      'user disconnected',
      socket.id,
      socket.userDetails.userName
    );
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
