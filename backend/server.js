const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! 🚀'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./models/User');

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userName = name || email.split('@')[0];

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      name: userName, 
      email, 
      password: hashedPassword, 
      role: role || 'Student' 
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint supporting both plain text and bcrypt passwords
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Support both hashed ($2...) passwords and old plain text strings safely
    const isMatch = user.password.startsWith('$2') 
      ? await bcrypt.compare(password, user.password) 
      : password === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ 
      message: 'Login successful!', 
      userId: user._id, 
      role: user.role,
      name: user.name 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});