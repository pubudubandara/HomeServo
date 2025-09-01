import Tasker from '../models/Tasker.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// GET /api/taskers/profile/check - Check if tasker profile exists (protected route)
export const checkTaskerProfile = async (req, res) => {
  try {
    // Check if user is authenticated and has tasker role
    if (!req.user || req.user.role !== 'tasker') {
      return res.status(403).json({ message: 'Access denied. Tasker role required.' });
    }

    // Check if tasker profile exists
    const existingTasker = await Tasker.findOne({ userId: req.user.userId });
    
    res.json({
      hasProfile: !!existingTasker,
      message: existingTasker ? 'Tasker profile exists' : 'Tasker profile not found'
    });
  } catch (err) {
    console.error('Check Tasker Profile Error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// GET /api/taskers/profile
export const getTaskerProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware and should contain userId
    const tasker = await Tasker.findOne({ userId: req.user.userId }).populate('userId', 'name email');
    if (!tasker) {
      return res.status(404).json({ message: 'Tasker profile not found' });
    }

    // Combine user and tasker data
    const profileData = {
      _id: tasker._id,
      name: tasker.userId.name,
      email: tasker.userId.email,
      phoneNumber: tasker.phoneNumber,
      addressLine1: tasker.addressLine1,
      addressLine2: tasker.addressLine2,
      city: tasker.city,
      stateProvince: tasker.stateProvince,
      postalCode: tasker.postalCode,
      country: tasker.country,
      category: tasker.category,
      experience: tasker.experience,
      hourlyRate: tasker.hourlyRate,
      bio: tasker.bio,
      skills: tasker.skills,
      profileImageUrl: tasker.profileImageUrl,
      createdAt: tasker.createdAt,
      updatedAt: tasker.updatedAt
    };

    res.json(profileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/taskers/profile - Create tasker profile after login (protected route)
export const createTaskerProfile = async (req, res) => {
  try {
    // Debug: log incoming body and file
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.file:', JSON.stringify(req.file, null, 2));

    // Check if user is authenticated and has tasker role
    if (!req.user || req.user.role !== 'tasker') {
      return res.status(403).json({ message: 'Access denied. Tasker role required.' });
    }

    // Check if tasker profile already exists
    const existingTasker = await Tasker.findOne({ userId: req.user.userId });
    if (existingTasker) {
      return res.status(400).json({ message: 'Tasker profile already exists' });
    }

    let {
      phoneNumber, addressLine1, addressLine2, city, stateProvince, 
      postalCode, country, category, experience, hourlyRate, bio, skills
    } = req.body;

    console.log('Extracted fields:', {
      phoneNumber, addressLine1, city, postalCode, country,
      category, experience, hourlyRate, bio, skills
    });

    // Validate required fields
    if (!addressLine1 || !city || !postalCode || !country || !category || !experience || !hourlyRate || !bio) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Parse skills if it's a string (from FormData)
    if (typeof skills === 'string') {
      try {
        // Try to parse as JSON array (if sent as JSON.stringify)
        skills = JSON.parse(skills);
      } catch {
        // Fallback: split by comma
        skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    console.log('Processed skills:', skills);

    // Get Cloudinary image URL if uploaded
    let profileImageUrl = '';
    if (req.file && req.file.path) {
      profileImageUrl = req.file.path;
      console.log('Profile image URL:', profileImageUrl);
    }

    // Create tasker profile
    console.log('Creating tasker profile...');
    const tasker = new Tasker({
      userId: req.user.userId,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      postalCode,
      country,
      category,
      experience,
      hourlyRate: Number(hourlyRate),
      bio,
      skills,
      profileImageUrl
    });

    await tasker.save();
    console.log('Tasker profile created with ID:', tasker._id);

    res.status(201).json({ 
      message: 'Tasker profile created successfully',
      tasker: {
        id: tasker._id,
        userId: tasker.userId,
        category: tasker.category,
        experience: tasker.experience,
        hourlyRate: tasker.hourlyRate
      }
    });
  } catch (err) {
    console.error('Create Tasker Profile Error Details:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Full error:', err);
    
    // Send more specific error information
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// PUT /api/taskers/profile
export const updateTaskerProfile = async (req, res) => {
  try {
    const {
      name, email, phoneNumber,
      addressLine1, addressLine2, city, stateProvince, postalCode, country,
      category, experience, hourlyRate, bio, skills
    } = req.body;

    // Parse skills if it's a string (from form data)
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      // If it's a comma-separated string, split it
      parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Update user information
    await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true }
    );

    // Update tasker information
    const updatedTasker = await Tasker.findOneAndUpdate(
      { userId: req.user.userId },
      {
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        country,
        category,
        experience,
        hourlyRate: Number(hourlyRate),
        bio,
        skills: parsedSkills
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!updatedTasker) {
      return res.status(404).json({ message: 'Tasker profile not found' });
    }

    // Combine user and tasker data for response
    const profileData = {
      _id: updatedTasker._id,
      name: updatedTasker.userId.name,
      email: updatedTasker.userId.email,
      phoneNumber: updatedTasker.phoneNumber,
      addressLine1: updatedTasker.addressLine1,
      addressLine2: updatedTasker.addressLine2,
      city: updatedTasker.city,
      stateProvince: updatedTasker.stateProvince,
      postalCode: updatedTasker.postalCode,
      country: updatedTasker.country,
      category: updatedTasker.category,
      experience: updatedTasker.experience,
      hourlyRate: updatedTasker.hourlyRate,
      bio: updatedTasker.bio,
      skills: updatedTasker.skills,
      profileImageUrl: updatedTasker.profileImageUrl,
      createdAt: updatedTasker.createdAt,
      updatedAt: updatedTasker.updatedAt
    };

    res.json({
      message: 'Profile updated successfully',
      tasker: profileData
    });
  } catch (err) {
    console.error('Update Tasker Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/taskers/test - Test endpoint to check taskers
export const getTaskers = async (req, res) => {
  try {
    const taskers = await Tasker.find().populate('userId', 'name email');
    res.json({
      message: 'Taskers retrieved successfully',
      count: taskers.length,
      taskers: taskers.map(tasker => ({
        _id: tasker._id,
        name: tasker.userId.name,
        email: tasker.userId.email,
        category: tasker.category,
        experience: tasker.experience,
        hourlyRate: tasker.hourlyRate
      }))
    });
  } catch (err) {
    console.error('Get Taskers Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
