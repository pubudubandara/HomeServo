
import mongoose from 'mongoose';

const TaskerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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
  skills: { type: String, required: true },
  profileImageUrl: { type: String }, // Cloudinary image URL
  role: {
    type: String,
    enum: ['tasker'],
    default: 'tasker',
    required: true,
  },
}, { timestamps: true });

const Tasker = mongoose.model('Tasker', TaskerSchema);
export default Tasker;
