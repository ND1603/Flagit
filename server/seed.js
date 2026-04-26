const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Report = require('./models/Report');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('  Cleared existing data');

    const hashedPassword = await bcrypt.hash('test1234', 10);

    const users = await User.insertMany([
      { name: 'Abebe Girma', email: 'abebe@gmail.com', password: hashedPassword, city: 'Addis Ababa' },
      { name: 'Tigist Haile', email: 'tigist@gmail.com', password: hashedPassword, city: 'Hawassa' },
      { name: 'Dawit Bekele', email: 'dawit@gmail.com', password: hashedPassword, city: 'Dire Dawa' },
    ]);

    console.log('👤 Users created');

    await Report.insertMany([
      {
        type: 'electricity',
        description: 'Power outage affecting the whole Bole area since this morning. No electricity for 6 hours.',
        location: { lat: 9.0227, lng: 38.7892, address: 'Bole Road, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 8,
        submittedBy: users[0]._id
      },
      {
        type: 'wifi',
        description: 'Ethio Telecom internet is completely down in Kazanchis. Cannot work from home.',
        location: { lat: 9.0107, lng: 38.7614, address: 'Kazanchis, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 12,
        submittedBy: users[0]._id
      },
      {
        type: 'water',
        description: 'No water supply in Piassa since yesterday evening. Residents are struggling.',
        location: { lat: 9.0356, lng: 38.7489, address: 'Piassa, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 5,
        submittedBy: users[1]._id
      },
      {
        type: 'road',
        description: 'Large pothole on the main road near Megenagna roundabout. Very dangerous at night.',
        location: { lat: 9.0372, lng: 38.8012, address: 'Megenagna, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 15,
        submittedBy: users[0]._id
      },
      {
        type: 'electricity',
        description: 'Electricity flickering and cutting out every few minutes in Sarbet area.',
        location: { lat: 8.9956, lng: 38.7612, address: 'Sarbet, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 3,
        submittedBy: users[1]._id
      },
      {
        type: 'water',
        description: 'Water pipe burst near the stadium. Road is flooded and water is wasted.',
        location: { lat: 9.0312, lng: 38.7634, address: 'Stadium Area, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 7,
        submittedBy: users[2]._id
      },
      {
        type: 'wifi',
        description: 'No internet in the whole Hawassa city center since this afternoon.',
        location: { lat: 7.0621, lng: 38.4762, address: 'Hawassa City Center' },
        city: 'Hawassa',
        upvoteCount: 9,
        submittedBy: users[1]._id
      },
      {
        type: 'road',
        description: 'Bridge road to Dire Dawa market completely damaged. Cars cannot pass.',
        location: { lat: 9.5931, lng: 41.8661, address: 'Dire Dawa Market Road' },
        city: 'Dire Dawa',
        upvoteCount: 11,
        submittedBy: users[2]._id
      },
      {
        type: 'other',
        description: 'Street lights on the entire Gerji road have been off for 2 weeks now.',
        location: { lat: 9.0156, lng: 38.8234, address: 'Gerji, Addis Ababa' },
        city: 'Addis Ababa',
        upvoteCount: 6,
        submittedBy: users[0]._id
      },
      {
        type: 'electricity',
        description: 'Complete blackout in Bahir Dar university area. Students cannot study.',
        location: { lat: 11.5742, lng: 37.3614, address: 'Bahir Dar University' },
        city: 'Bahir Dar',
        upvoteCount: 4,
        submittedBy: users[1]._id
      },
    ]);

    console.log(' Reports created');
    console.log(' Seed complete! You can now test your frontend with real data.');
    console.log(' Test login: abebe@gmail.com / test1234');
    process.exit(0);

  } catch (err) {
    console.error(' Seed failed:', err.message);
    process.exit(1);
  }
};

seed();