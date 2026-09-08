const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import protection middleware
const protect = require('./middleware/authMiddleware');

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

// Protected Route Example
app.get('/api/protected', protect, (req, res) => {
    res.json({ 
        message: 'You have accessed a protected route successfully!', 
        userId: req.user 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});