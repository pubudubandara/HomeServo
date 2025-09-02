
import mongoose from 'mongoose';

const TaskerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  phoneNumber: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  stateProvince: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  bio: { type: String, required: true },
  skills: { type: [String], default: [] },
  profileImageUrl: { type: String }, // Cloudinary image URL
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'], 
    default: 'pending' 
  },
}, { timestamps: true });

const Tasker = mongoose.model('Tasker', TaskerSchema);
export default Tasker;
