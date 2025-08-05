
import Tasker from '../models/Tasker.js';
import bcrypt from 'bcryptjs';

// POST /api/taskers
export const registerTasker = async (req, res) => {
  try {
    const {
      username, password, fullName, email, phoneNumber,
      addressLine1, addressLine2, city, stateProvince, postalCode, country,
      category, experience, hourlyRate, bio, skills
    } = req.body;

    // Check for existing user
    const existing = await Tasker.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: 'Username or email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get Cloudinary image URL if uploaded
    let profileImageUrl = '';
    if (req.file && req.file.path) {
      profileImageUrl = req.file.path;
    }

    const tasker = new Tasker({
      username,
      password: hashedPassword,
      fullName,
      email,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      postalCode,
      country,
      category,
      experience,
      hourlyRate,
      bio,
      skills,
      profileImageUrl
    });

    await tasker.save();
    res.status(201).json({ message: 'Tasker registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
