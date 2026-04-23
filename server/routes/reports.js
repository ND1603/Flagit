const { body, validationResult } = require('express-validator');
const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const protect = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const filter = {
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    if (req.query.type) filter.type = req.query.type;
    if (req.query.city) filter.city = req.query.city;

const reports = await Report.find(filter)
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, upload.single('photo'), [
  body('type').isIn(['electricity', 'wifi', 'water', 'road', 'other']).withMessage('Invalid report type'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('lat').notEmpty().withMessage('Location is required').isNumeric().withMessage('Invalid coordinates'),
  body('lng').notEmpty().withMessage('Location is required').isNumeric().withMessage('Invalid coordinates'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { type, description, lat, lng, address, city } = req.body;

    if (!type || !description || !lat || !lng) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const report = await Report.create({
      type,
      description,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address
      },
      city,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      submittedBy: req.user.id
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/upvote', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const alreadyUpvoted = report.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      report.upvotes = report.upvotes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      report.upvotes.push(req.user.id);
    }

    report.upvoteCount = report.upvotes.length;
    await report.save();

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/upvote', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const alreadyUpvoted = report.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      report.upvotes = report.upvotes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      report.upvotes.push(req.user.id);
    }

    report.upvoteCount = report.upvotes.length;
    await report.save();

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await report.deleteOne();

    res.json({ message: 'Report deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;