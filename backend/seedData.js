import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tasker from './models/Tasker.js';
import Service from './models/Service.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
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

// Sample data
const sampleData = [
  {
    user: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      password: 'password123',
      role: 'tasker'
    },
    tasker: {
      skills: ['cleaning', 'maintenance'],
      experience: 5,
      hourlyRate: 25,
      availability: ['monday', 'tuesday', 'wednesday'],
      bio: 'Professional cleaner with 5 years of experience'
    },
    services: [
      {
        title: 'Professional House Cleaning',
        category: 'Cleaning',
        description: 'Complete house cleaning service including all rooms, kitchen, and bathrooms. We use eco-friendly products and guarantee satisfaction.',
        price: 35,
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        tags: ['cleaning', 'house', 'eco-friendly'],
        status: 'active',
        state: 'approved',
        rating: 4.8,
        jobsCompleted: 127
      },
      {
        title: 'Deep Cleaning Service',
        category: 'Cleaning',
        description: 'Thorough deep cleaning for homes that need extra attention. Perfect for move-ins or seasonal cleaning.',
        price: 50,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
        tags: ['deep-cleaning', 'thorough', 'seasonal'],
        status: 'active',
        state: 'approved',
        rating: 4.9,
        jobsCompleted: 89
      }
    ]
  },
  {
    user: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      password: 'password123',
      role: 'tasker'
    },
    tasker: {
      skills: ['repairs', 'maintenance', 'painting'],
      experience: 8,
      hourlyRate: 35,
      availability: ['monday', 'wednesday', 'friday'],
      bio: 'Experienced handyman specializing in home repairs'
    },
    services: [
      {
        title: 'Home Repair Services',
        category: 'Repairs',
        description: 'Professional home repair services including plumbing, electrical, and general maintenance work. Licensed and insured.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
        tags: ['repairs', 'maintenance', 'handyman'],
        status: 'active',
        state: 'approved',
        rating: 4.7,
        jobsCompleted: 203
      },
      {
        title: 'Interior Painting',
        category: 'Painting',
        description: 'Professional interior painting service for rooms, walls, and ceilings. High-quality finish guaranteed with premium paints.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
        tags: ['painting', 'interior', 'walls'],
        status: 'active',
        state: 'approved',
        rating: 4.6,
        jobsCompleted: 156
      }
    ]
  },
  {
    user: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      password: 'password123',
      role: 'tasker'
    },
    tasker: {
      skills: ['assembly', 'mounting'],
      experience: 3,
      hourlyRate: 30,
      availability: ['tuesday', 'thursday', 'saturday'],
      bio: 'Expert in furniture assembly and wall mounting'
    },
    services: [
      {
        title: 'Furniture Assembly',
        category: 'Assembly',
        description: 'Professional furniture assembly service for all types of furniture including IKEA, office furniture, and more. Fast and reliable.',
        price: 35,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        tags: ['assembly', 'furniture', 'IKEA'],
        status: 'active',
        state: 'approved',
        rating: 4.5,
        jobsCompleted: 78
      },
      {
        title: 'TV and Picture Mounting',
        category: 'Mounting',
        description: 'Safe and secure mounting of TVs, pictures, mirrors, and other wall decorations. Professional installation guaranteed.',
        price: 30,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        tags: ['mounting', 'TV', 'pictures'],
        status: 'active',
        state: 'approved',
        rating: 4.8,
        jobsCompleted: 92
      }
    ]
  }
];

const createSampleData = async () => {
  try {
    await connectDB();
    
    console.log('Creating sample data...');
    
    // Clear existing data
    await Service.deleteMany({});
    await Tasker.deleteMany({});
    await User.deleteMany({ role: 'tasker' });
    
    for (const data of sampleData) {
      // Create user
      const user = new User(data.user);
      await user.save();
      
      // Create tasker
      const tasker = new Tasker({
        userId: user._id,
        ...data.tasker
      });
      await tasker.save();
      
      // Create services
      for (const serviceData of data.services) {
        const service = new Service({
          taskerId: tasker._id,
          ...serviceData
        });
        await service.save();
      }
    }
    
    console.log('Sample data created successfully!');
    
    // Log the created services
    const services = await Service.find({}).populate({
      path: 'taskerId',
      populate: {
        path: 'userId',
        select: 'firstName lastName email'
      }
    });
    
    console.log(`Created ${services.length} services:`);
    services.forEach(service => {
      console.log(`- ${service.title} by ${service.taskerId.userId.firstName} ${service.taskerId.userId.lastName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

createSampleData();
