module.exports = (io, socket) => {
    socket.on('user:join', (userData) => {
      console.log(`${userData.username} joined`);
      io.emit('user:joined', userData);
    });
  
    socket.on('user:leave', (userData) => {
      console.log(`${userData.username} left`);
      io.emit('user:left', userData);
    });
  };
  