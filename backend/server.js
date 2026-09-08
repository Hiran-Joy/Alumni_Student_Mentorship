const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import protection and role-check middlewares
const protect = require('./middleware/authMiddleware');
const authorizeRoles = require('./middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully! 🚀'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema (Reference structure for your project)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Alumni', 'Admin'], default: 'Student' }
});

const User = mongoose.model('User', userSchema);

// Root route
app.get('/', (req, res) => {
    res.send('Backend server is up and running!');
});

// Register Route with Password Hashing
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        // Hash the password securely using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route with JWT Token Generation
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found!" });

        // Compare submitted password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        // Generate JWT Token valid for 1 hour
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role, message: "Logged in successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected Route Example (Any authenticated user)
app.get('/api/protected', protect, (req, res) => {
    res.json({ 
        message: 'You have accessed a protected route successfully!', 
        userId: req.user 
    });
});

// Role-Restricted Route Example (Only Alumni or Admin can access)
app.get('/api/alumni-dashboard', protect, authorizeRoles('Alumni', 'Admin'), (req, res) => {
    res.json({ 
        message: 'Welcome to the exclusive alumni mentorship dashboard!', 
        user: req.user 
    });
});

// User Profile Route (Updated to handle direct user ID or object structures safely)
app.get('/api/profile', protect, async (req, res) => {
    try {
        const userId = req.user.userId || req.user;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});