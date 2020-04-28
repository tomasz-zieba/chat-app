/* eslint-disable global-require */
let io;
module.exports = {
  socketUsers: {},
  init: (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Sicket.io not initialized!');
    }
    return io;
  },
  addUser(userId, socketId) {
    this.socketUsers[userId] = {
      socket: socketId,
    };
  },
};
