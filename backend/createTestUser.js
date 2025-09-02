import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Tasker from './models/Tasker.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestUser = async () => {
  try {
    await connectDB();
    
    // Create a test tasker user
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const testUser = new User({
      name: 'Test Tasker',
      email: 'testtasker@example.com',
      password: hashedPassword,
      role: 'tasker'
    });
    
    await testUser.save();
    console.log('Test user created:', testUser);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
