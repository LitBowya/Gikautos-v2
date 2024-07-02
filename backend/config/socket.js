import { Server } from 'socket.io';
import { config } from 'dotenv'
config()

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChannel', (channelId) => {
      socket.join(channelId);
      console.log(`User joined channel ${channelId}`);
    });

    socket.on('leaveChannel', (channelId) => {
      socket.leave(channelId);
      console.log(`User left channel ${channelId}`);
    });

    socket.on('sendMessage', (message) => {
      io.to(message.channel).emit('message', message);
    });

    socket.on('editMessage', (message) => {
      io.to(message.channel).emit('editMessage', message);
    });

    socket.on('deleteMessage', (messageId, channelId) => {
      io.to(channelId).emit('deleteMessage', messageId);
    });

    socket.on('reactToMessage', (message) => {
      io.to(message.channel).emit('reactToMessage', message);
    });

    socket.on('replyToMessage', (reply) => {
      io.to(reply.message).emit('replyToMessage', reply);
    });

    socket.on('sendDirectMessage', (message) => {
      io.emit('receiveDirectMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.close();
  });

  return io;
};

export default configureSocket;
