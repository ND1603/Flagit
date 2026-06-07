const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments();

    const byCategory = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const byCity = await Report.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);

    const topReports = await Report.find()
      .sort({ upvotes: -1 })
      .limit(5)
      .select('title type city upvotes createdAt');

    res.json({ totalReports, totalUsers, byCategory, byCity, topReports });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Temporary route to make a user admin 
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (secret !== 'flagit-admin-2026') {
      return res.status(403).json({ message: 'Wrong secret' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} is now an admin!` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
