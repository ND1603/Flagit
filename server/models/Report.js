const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['electricity', 'wifi', 'water', 'road', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  city: {
    type: String,
    default: 'Dire Dawa'
  },
  photo: {
    type: String
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);