const socketIO = require('socket.io');

let io;

exports.init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room: user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

exports.sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};