import { Server as SocketIOServer } from 'socket.io';
import User from '../models/userModel.js'; // Adjust the import as needed

let io;

const initSocket = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    const onlineUsers = new Set();

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Access the userId from query parameters
        const userId = socket.handshake.query.userId;
        console.log("userId", userId)

        if (userId) {
            onlineUsers.add(userId);
            io.emit('userStatusUpdate', { userId, status: 'online' });

            // Update user's online status in the database
            User.findByIdAndUpdate(userId, { isOnline: true }, { new: true }).catch(console.error);
        }

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);

            if (userId) {
                onlineUsers.delete(userId);
                io.emit('userStatusUpdate', { userId, status: 'offline' });

                // Update user's online status in the database
                User.findByIdAndUpdate(userId, { isOnline: false }, { new: true }).catch(console.error);
            }
        });

        // Handle location update from client
        socket.on('updateLocation', (data) => {
            console.log(`Location update received: ${data}`);
            io.emit('locationUpdate', data); // Broadcast to all connected clients
        });
    });

    return io;
};

// Export the io instance
export { initSocket, io };
