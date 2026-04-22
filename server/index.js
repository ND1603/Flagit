const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));

app.get('/',(req, res) => {
    res.json({message: 'Flagit API is running'});
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
        console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('failed to connect to MongoDB:', err.message);
  });