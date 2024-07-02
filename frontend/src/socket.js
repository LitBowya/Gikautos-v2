// frontend socket client

import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.close();

export default socket;

