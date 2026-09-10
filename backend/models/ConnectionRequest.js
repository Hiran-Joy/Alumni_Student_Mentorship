const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);