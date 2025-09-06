import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Generate token for testing
      const token = jwt.sign(
        { userId: existingAdmin._id, role: existingAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('Admin token for testing:', token);
      
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    const savedAdmin = await adminUser.save();
    console.log('Created admin user:', savedAdmin._id);

    // Generate token for testing
    const token = jwt.sign(
      { userId: savedAdmin._id, role: savedAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Admin token for testing:', token);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdminUser();
