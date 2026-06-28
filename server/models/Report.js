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
   status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
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

reportSchema.index({ type: 1, city: 1, isActive: 1 });
reportSchema.index({ submittedBy: 1 });
reportSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Report', reportSchema);
