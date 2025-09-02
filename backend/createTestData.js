import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tasker from './models/Tasker.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Tasker.deleteMany({});
    
    // Create test users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Mike Wilson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'tasker'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'tasker'
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create test taskers for the users with role 'tasker'
    const taskerUsers = users.filter(user => user.role === 'tasker');
    
    const taskers = await Tasker.create([
      {
        userId: taskerUsers[0]._id, // Mike Wilson
        phoneNumber: '+94771234567',
        addressLine1: '123 Main Street',
        city: 'Colombo',
        postalCode: '00100',
        country: 'Sri Lanka',
        category: 'Cleaning',
        experience: '3 years',
        hourlyRate: 25,
        bio: 'Professional cleaner with 3 years of experience',
        skills: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
        status: 'pending'
      },
      {
        userId: taskerUsers[1]._id, // Sarah Johnson
        phoneNumber: '+94777654321',
        addressLine1: '456 Oak Avenue',
        city: 'Kandy',
        postalCode: '20000',
        country: 'Sri Lanka',
        category: 'Repairs',
        experience: '5 years',
        hourlyRate: 35,
        bio: 'Experienced handyman specializing in home repairs',
        skills: ['Plumbing', 'Electrical', 'Carpentry'],
        status: 'approved'
      }
    ]);

    console.log(`Created ${taskers.length} taskers`);
    console.log('Test data created successfully!');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  createTestData();
});
