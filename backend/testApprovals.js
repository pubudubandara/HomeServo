import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tasker from './models/Tasker.js';

dotenv.config();

// Test database connection and check pending taskers
async function testDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    
    // Check pending taskers
    const pendingTaskers = await Tasker.find({ status: 'pending' })
      .populate('userId', 'name email');
    
    console.log('Pending taskers found:', pendingTaskers.length);
    
    if (pendingTaskers.length > 0) {
      console.log('Sample pending tasker:');
      console.log(JSON.stringify(pendingTaskers[0], null, 2));
    }
    
    // Check all taskers to see their status distribution
    const allTaskers = await Tasker.find({});
    const statusCounts = {};
    allTaskers.forEach(tasker => {
      statusCounts[tasker.status] = (statusCounts[tasker.status] || 0) + 1;
    });
    
    console.log('Tasker status distribution:', statusCounts);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testDatabase();
