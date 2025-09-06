import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tasker from './models/Tasker.js';

dotenv.config();

async function createTestTasker() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Create a test user first
    const testUser = new User({
      name: 'Test Tasker User',
      email: 'testtasker@example.com',
      password: 'testpassword123',
      role: 'tasker'
    });
    
    const savedUser = await testUser.save();
    console.log('Created test user:', savedUser._id);

    // Create a test tasker with pending status
    const testTasker = new Tasker({
      userId: savedUser._id,
      phoneNumber: '+1234567890',
      addressLine1: '123 Test Street',
      city: 'Test City',
      postalCode: '12345',
      country: 'Test Country',
      category: 'cleaning',
      experience: '2-3 years',
      hourlyRate: 25,
      bio: 'Test tasker for approval testing',
      skills: ['cleaning', 'organizing'],
      status: 'pending'
    });

    const savedTasker = await testTasker.save();
    console.log('Created test tasker:', savedTasker._id);
    console.log('Tasker status:', savedTasker.status);

    // Verify it was created correctly
    const foundTasker = await Tasker.findById(savedTasker._id).populate('userId');
    console.log('Found tasker:', foundTasker);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestTasker();
