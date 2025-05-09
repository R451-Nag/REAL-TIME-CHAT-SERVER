const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO room logic
io.on('connection', (socket) => {
  console.log('✅ New user connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`🔗 ${socket.id} joined room: ${room}`);
    socket.to(room).emit('message', `🔔 A user joined room: ${room}`);
  });

  socket.on('chatMessage', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Chat server running at http://localhost:${PORT}`);
});
