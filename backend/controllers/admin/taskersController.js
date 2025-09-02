import Tasker from '../../models/Tasker.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

export const getAllTaskers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const category = req.query.category || '';
    
    // Build filter query
    let filter = {};
    if (search) {
      // For search, we need to find users first and then match their IDs
      const userFilter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
      
      const User = mongoose.model('User');
      const matchingUsers = await User.find(userFilter, '_id');
      const userIds = matchingUsers.map(user => user._id);
      
      filter.userId = { $in: userIds };
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const taskers = await Tasker.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Transform the data to match frontend expectations
    const transformedTaskers = taskers.map(tasker => ({
      ...tasker.toObject(),
      user: tasker.userId,
      userId: undefined // Remove the userId field
    }));
      
    const totalTaskers = await Tasker.countDocuments(filter);
    
    res.json({
      taskers: transformedTaskers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTaskers / limit),
        totalTaskers,
        hasNextPage: page < Math.ceil(totalTaskers / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get taskers error:', error);
    res.status(500).json({ message: 'Error fetching taskers', error: error.message });
  }
};

export const getTaskerById = async (req, res) => {
  try {
    const { id } = req.params;
    const tasker = await Tasker.findById(id);
    if (!tasker) return res.status(404).json({ message: 'Tasker not found' });
    res.json(tasker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasker', error });
  }
};

export const approveTasker = async (req, res) => {
  try {
    const { id } = req.params;
    await Tasker.findByIdAndUpdate(id, { status: 'approved' });
    res.json({ message: 'Tasker approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving tasker', error });
  }
};

export const rejectTasker = async (req, res) => {
  try {
    const { id } = req.params;
    await Tasker.findByIdAndUpdate(id, { status: 'rejected' });
    res.json({ message: 'Tasker rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting tasker', error });
  }
};

export const updateTaskerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Tasker.findByIdAndUpdate(id, { status });
    res.json({ message: 'Tasker status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tasker status', error });
  }
};
