import io from 'socket.io-client';

const userId = '6683caa6f755e46f9287d106'; // Replace with your test user ID

const socket = io('http://localhost:5000', {
    query: { userId } // Pass the userId as a query parameter
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
    console.log(`Connected with userId: ${userId}`);
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

socket.on('userStatusUpdate', (data) => {
    console.log('User status update:', data);
});
