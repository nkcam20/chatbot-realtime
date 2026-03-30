import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import User from './models/User.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Socket.IO Logic
const users = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('setup', (userId) => {
    socket.join(userId);
    users.set(userId, socket.id);
    User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() }).exec();
    socket.broadcast.emit('user_online', userId);
    console.log('User joined:', userId);
  });

  socket.on('join_chat', (room) => {
    socket.join(room);
    console.log('User joined room:', room);
  });

  socket.on('typing', (data) => {
    // data: { senderId, receiverId }
    socket.in(data.receiverId).emit('typing', data.senderId);
  });

  socket.on('stop_typing', (data) => {
    socket.in(data.receiverId).emit('stop_typing', data.senderId);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;
    try {
      const newMessage = new Message({ senderId, receiverId, content });
      const savedMessage = await newMessage.save();
      
      // Emit to receiver and sender (for sync across tabs)
      io.to(receiverId).to(senderId).emit('message_received', savedMessage);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        users.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      User.findByIdAndUpdate(disconnectedUserId, { isOnline: false, lastSeen: new Date() }).exec();
      socket.broadcast.emit('user_offline', disconnectedUserId);
    }
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
