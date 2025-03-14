// backend/createTestUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const username = 'testuser';
    const password = 'password123'; // Plain text (will be hashed)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log('Test user created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

createUser();
