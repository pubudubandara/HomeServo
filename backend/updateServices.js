import mongoose from 'mongoose';
import Service from './models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

const updateServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all services to be active and approved
    const result = await Service.updateMany(
      { status: 'inactive', state: 'pending' },
      {
        $set: {
          status: 'active',
          state: 'approved'
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} services`);

    // Check current services
    const services = await Service.find({});
    console.log(`Total services in DB: ${services.length}`);
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} - Status: ${service.status}, State: ${service.state}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateServices();
