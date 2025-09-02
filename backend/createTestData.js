import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Tasker from './models/Tasker.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';

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

const createTestData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Creating comprehensive test data...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Booking.deleteMany({});
    console.log('✓ Cleared bookings');
    await Service.deleteMany({});
    console.log('✓ Cleared services');
    await Tasker.deleteMany({});
    console.log('✓ Cleared taskers');
    await User.deleteMany({});
    console.log('✓ Cleared users');
    
    // Create test users (customers and taskers)
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    // Create customers
    const customer1 = new User({
      name: 'John Customer',
      email: 'customer1@example.com',
      password: hashedPassword,
      role: 'user'
    });
    await customer1.save();
    
    const customer2 = new User({
      name: 'Jane Customer',
      email: 'customer2@example.com', 
      password: hashedPassword,
      role: 'user'
    });
    await customer2.save();
    
    // Create tasker users
    const taskerUser1 = new User({
      name: 'Mike Cleaner',
      email: 'mikecleaner@example.com',
      password: hashedPassword,
      role: 'tasker'
    });
    await taskerUser1.save();
    
    const taskerUser2 = new User({
      name: 'Sarah Handywoman',
      email: 'sarahhandy@example.com',
      password: hashedPassword,
      role: 'tasker'
    });
    await taskerUser2.save();
    
    // Create tasker profiles
    const tasker1 = new Tasker({
      userId: taskerUser1._id,
      phoneNumber: '123-456-7890',
      addressLine1: '123 Clean St',
      city: 'CleanCity',
      postalCode: '12345',
      country: 'USA',
      category: 'Cleaning',
      experience: 'Advanced',
      hourlyRate: 25,
      bio: 'Professional cleaner with 5 years experience',
      skills: ['deep cleaning', 'house cleaning', 'office cleaning']
    });
    await tasker1.save();
    
    const tasker2 = new Tasker({
      userId: taskerUser2._id,
      phoneNumber: '987-654-3210',
      addressLine1: '456 Fix Ave',
      city: 'RepairTown',
      postalCode: '67890',
      country: 'USA',
      category: 'Home Repairs',
      experience: 'Expert',
      hourlyRate: 40,
      bio: 'Expert handywoman for all your repair needs',
      skills: ['plumbing', 'electrical', 'carpentry']
    });
    await tasker2.save();
    
    // Create services
    const service1 = new Service({
      taskerId: tasker1._id,
      title: 'House Deep Cleaning',
      category: 'Cleaning',
      description: 'Complete deep cleaning service for your home',
      price: 80,
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
      tags: ['cleaning', 'deep-clean'],
      status: 'active',
      state: 'approved'
    });
    await service1.save();
    
    const service2 = new Service({
      taskerId: tasker1._id,
      title: 'Office Cleaning',
      category: 'Cleaning', 
      description: 'Professional office cleaning service',
      price: 60,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      tags: ['cleaning', 'office'],
      status: 'active',
      state: 'approved'
    });
    await service2.save();
    
    const service3 = new Service({
      taskerId: tasker2._id,
      title: 'Plumbing Repair',
      category: 'Home Repairs',
      description: 'Professional plumbing repair and maintenance',
      price: 100,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      tags: ['plumbing', 'repairs'],
      status: 'active',
      state: 'approved'
    });
    await service3.save();
    
    // Create test bookings
    const bookings = [
      {
        userId: customer1._id,
        serviceId: service1._id,
        customerPhone: '555-0001',
        serviceDescription: 'Need deep cleaning for 3-bedroom house',
        serviceLocation: '789 Main St, TestCity',
        preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        customerNotes: 'Please focus on kitchen and bathrooms',
        status: 'pending'
      },
      {
        userId: customer2._id,
        serviceId: service1._id,
        customerPhone: '555-0002',
        serviceDescription: 'Weekly house cleaning service',
        serviceLocation: '456 Oak Ave, TestCity',
        preferredDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        customerNotes: 'I have pets, please use pet-safe products',
        status: 'confirmed'
      },
      {
        userId: customer1._id,
        serviceId: service2._id,
        customerPhone: '555-0003',
        serviceDescription: 'Office cleaning for small business',
        serviceLocation: '123 Business Blvd, TestCity',
        preferredDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // In 3 days
        customerNotes: 'After business hours only',
        status: 'in-progress'
      },
      {
        userId: customer2._id,
        serviceId: service3._id,
        customerPhone: '555-0004',
        serviceDescription: 'Fix leaky kitchen faucet',
        serviceLocation: '999 Water St, TestCity',
        preferredDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday (completed)
        customerNotes: 'Urgent repair needed',
        status: 'completed',
        actualCost: 85
      },
      {
        userId: customer1._id,
        serviceId: service3._id,
        customerPhone: '555-0005',
        serviceDescription: 'Install new bathroom sink',
        serviceLocation: '111 Home Ave, TestCity',
        preferredDate: new Date(Date.now() + 96 * 60 * 60 * 1000), // In 4 days
        customerNotes: 'All parts will be provided',
        status: 'pending'
      }
    ];
    
    for (const bookingData of bookings) {
      const booking = new Booking(bookingData);
      await booking.save();
    }
    
    console.log(`✓ Created ${bookings.length} test bookings`);
    console.log(`✓ Created 2 customers: ${customer1.email}, ${customer2.email}`);
    console.log(`✓ Created 2 taskers: ${taskerUser1.email}, ${taskerUser2.email}`);
    console.log(`✓ Created 3 services`);
    
    console.log('\nTest login credentials:');
    console.log('Customer: customer1@example.com / 123456');
    console.log('Tasker: mikecleaner@example.com / 123456');
    console.log('Tasker: sarahhandy@example.com / 123456');
    
    console.log('\nTasker IDs for testing:');
    console.log(`Mike Cleaner (tasker1): ${tasker1._id}`);
    console.log(`Sarah Handywoman (tasker2): ${tasker2._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
