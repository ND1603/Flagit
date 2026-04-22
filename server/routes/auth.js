const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d'});
};

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, city } = req.body;
        
        // check if all fields are provided
        if(!name || !email || !password) {
            return res.status(400).json({message: 'Please fill in all fields'});
        }

        // check if email already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user
        const user = await User.create({
            name,
            email,password: hashedPassword,
            city
        });

        //sending back token and user info
        res.status(201).json({
            token:generateToken(user._id),
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                city: user.city

            }
        });
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      city
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;