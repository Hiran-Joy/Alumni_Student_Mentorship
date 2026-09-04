const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Needed to read your .env file

const app = express();
const PORT = 5000; // Kept your original port style!

// Connect to MongoDB Atlas using your .env variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! 🚀'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});