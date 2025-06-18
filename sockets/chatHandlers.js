module.exports = (io, socket) => {
    socket.on('chat:sendMessage', (data) => {
      // handle the message
      console.log('Received message:', data);
  
      // broadcast to others
      socket.broadcast.emit('chat:receiveMessage', data);
    });
  
    socket.on('chat:typing', (user) => {
      socket.broadcast.emit('chat:userTyping', user);
    });
  };
  