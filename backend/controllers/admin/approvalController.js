import Tasker from '../../models/Tasker.js';

export const getApprovalRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const pendingTaskers = await Tasker.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Transform the data to match frontend expectations
    const transformedTaskers = pendingTaskers.map(tasker => ({
      ...tasker.toObject(),
      user: tasker.userId,
      userId: undefined // Remove the userId field
    }));
      
    const totalPending = await Tasker.countDocuments({ status: 'pending' });
    
    res.json({
      pendingTaskers: transformedTaskers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPending / limit),
        totalPending,
        hasNextPage: page < Math.ceil(totalPending / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get approval requests error:', error);
    res.status(500).json({ message: 'Error fetching approval requests', error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Tasker.findByIdAndUpdate(id, { status: 'approved' });
    res.json({ message: 'Request approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Tasker.findByIdAndUpdate(id, { status: 'rejected' });
    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error });
  }
};
