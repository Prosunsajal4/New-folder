import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://studentosbackend.vercel.app';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('notification', (notification) => {
    console.log('New notification:', notification);
    window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;