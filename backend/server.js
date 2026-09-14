const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! 🚀'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import Models
const User = require('./models/User');
const ConnectionRequest = require('./models/ConnectionRequest');
const Message = require('./models/Message');

// Simple Token Middleware (Using userId representation for quick frontend state sync)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({ message: 'Invalid or missing token. Please log in again.' });
  }
  try {
    req.userId = token;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Socket.io Real-Time Connection Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('send_message', async (data) => {
    try {
      const { sender, receiver, message, isAudio, room } = data;
      const newMessage = new Message({ sender, receiver, message, isAudio: !!isAudio });
      await newMessage.save();

      io.to(room).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Socket send message error:', err);
    }
  });

  socket.on('delete_message', async (data) => {
    try {
      const { messageId, room } = data;
      await Message.findByIdAndUpdate(messageId, { 
        message: 'This message was deleted', 
        isAudio: false, 
        isDeleted: true 
      });

      io.to(room).emit('message_deleted', messageId);
    } catch (err) {
      console.error('Socket delete message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Public route to view approved alumni directory without logging in
app.get('/api/public/alumni', async (req, res) => {
  try {
    const alumni = await User.find({ role: 'Alumni', status: 'Approved' }).select('-password');
    res.json(alumni);
  } catch (err) {
    console.error('Fetch public alumni error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration endpoint (Admins auto-approved, others start as Pending)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userName = name || email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || 'Student';
    const userStatus = assignedRole === 'Admin' ? 'Approved' : 'Pending';

    const newUser = new User({ 
      name: userName, 
      email, 
      password: hashedPassword, 
      role: assignedRole,
      status: userStatus
    });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful! Waiting for admin approval.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint with approval check
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = user.password.startsWith('$2') 
      ? await bcrypt.compare(password, user.password) 
      : password === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'Approved' && user.role !== 'Admin') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }

    res.status(200).json({ 
      message: 'Login successful!', 
      token: user._id.toString(),
      userId: user._id, 
      role: user.role,
      name: user.name 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update user status (Approve/Reject)
app.put('/api/admin/user/:id', verifyToken, async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: 'User status updated', updatedUser });
  } catch (err) {
    console.error('Admin update user status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get list of Approved Alumni (for Students)
app.get('/api/alumni', verifyToken, async (req, res) => {
  try {
    const alumni = await User.find({ role: 'Alumni', status: 'Approved' }).select('-password');
    res.json(alumni);
  } catch (err) {
    console.error('Fetch alumni error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Send Connection Request (for Students)
app.post('/api/connection-request', verifyToken, async (req, res) => {
  try {
    const { alumniId, message } = req.body;
    const existing = await ConnectionRequest.findOne({ student: req.userId, alumni: alumniId });
    if (existing) {
      return res.status(400).json({ message: 'Request already sent to this alumni' });
    }
    const newRequest = new ConnectionRequest({
      student: req.userId,
      alumni: alumniId,
      status: 'Pending',
      message: message || ''
    });
    await newRequest.save();
    res.status(201).json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('Connection request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Get Student's Sent Requests
app.get('/api/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ student: req.userId }).populate('alumni', 'email name');
    res.json(requests);
  } catch (err) {
    console.error('Fetch my requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Get Incoming Requests (for Alumni)
app.get('/api/connection-requests', verifyToken, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ alumni: req.userId }).populate('student', 'email name');
    res.json(requests);
  } catch (err) {
    console.error('Fetch incoming requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Update Request Status (Accept/Reject for Alumni)
app.put('/api/connection-request/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ConnectionRequest.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ message: 'Status updated', request });
  } catch (err) {
    console.error('Update request status error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Get chat history between two users
app.get('/api/messages/:userId/:otherId', verifyToken, async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const history = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    }).sort('timestamp');
    res.json(history);
  } catch (err) {
    console.error('Fetch chat history error:', err);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});