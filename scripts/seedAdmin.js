const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const { connectDB } = require('../src/config/db');
const { DB_URI } = require('../src/config');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@appraisersdesk.com' });
  if (existing) {
    console.log('Admin user already exists.');
    return process.exit(0);
  }

  const password = 'Admin123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@appraisersdesk.com',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin user created successfully.');
  console.log('Email:', admin.email);
  console.log('Password:', password);
  console.log('DB_URI:', DB_URI);

  return process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
