import Tasker from '../../models/Tasker.js';

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
      filter.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.serviceCategories = { $in: [category] };
    }
    
    const taskers = await Tasker.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalTaskers = await Tasker.countDocuments(filter);
    
    res.json({
      taskers,
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
