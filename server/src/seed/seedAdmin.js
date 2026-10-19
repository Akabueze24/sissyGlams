require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME || 'User';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email: email.toLowerCase().trim() });

  if (existing) {
    existing.role = 'admin';
    existing.firstName = firstName;
    existing.lastName = lastName;
    existing.password = password; // pre('save') hashes it
    await existing.save();
    console.log('Updated user to admin:', email);
  } else {
    await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
    });
    console.log('Created admin:', email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});