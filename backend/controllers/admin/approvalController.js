import Service from '../../models/Service.js';

export const getApprovalRequests = async (req, res) => {
  try {
    console.log('=== GET APPROVAL REQUESTS ===');
    console.log('User:', req.user);
    console.log('Query params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    console.log('Searching for services with state: pending');
    const pendingServices = await Service.find({ state: 'pending' })
      .populate({
        path: 'taskerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    console.log('Found pending services:', pendingServices.length);
    
    // Debug: Log the first service to see the data structure
    if (pendingServices.length > 0) {
      console.log('Sample service data:', JSON.stringify(pendingServices[0], null, 2));
    }
    
    // Also check total count in database
    const totalServices = await Service.countDocuments({});
    const allStates = await Service.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } }
    ]);
    console.log('Total services in DB:', totalServices);
    console.log('State distribution:', allStates);
      
    // Transform the data to match frontend expectations
    const transformedServices = pendingServices.map(service => ({
      id: service._id,
      taskerId: service._id, // Use service ID for approve/reject actions
      taskerName: service.taskerId?.userId?.name || 'N/A',
      email: service.taskerId?.userId?.email || 'N/A',
      category: service.category,
      title: service.title,
      description: service.description,
      price: service.price,
      submittedDate: new Date(service.createdAt).toLocaleDateString(),
      priority: 'normal',
      experience: service.taskerId?.experience || 'N/A',
      location: service.taskerId?.city || 'N/A',
      phone: service.taskerId?.phoneNumber || 'N/A',
      skills: service.tags || [],
      serviceId: service._id,
      actualTaskerId: service.taskerId?._id // Keep the actual tasker ID if needed
    }));
      
    const totalPending = await Service.countDocuments({ state: 'pending' });
    
    const response = {
      pendingTaskers: transformedServices, // Keep the same property name for frontend compatibility
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPending / limit),
        totalPending,
        hasNextPage: page < Math.ceil(totalPending / limit),
        hasPrevPage: page > 1
      }
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Get approval requests error:', error);
    res.status(500).json({ message: 'Error fetching approval requests', error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Approving service with ID:', id);
    await Service.findByIdAndUpdate(id, { state: 'approved' });
    res.json({ message: 'Service approved' });
  } catch (error) {
    console.error('Error approving service:', error);
    res.status(500).json({ message: 'Error approving service', error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Rejecting service with ID:', id);
    await Service.findByIdAndUpdate(id, { state: 'rejected' });
    res.json({ message: 'Service rejected' });
  } catch (error) {
    console.error('Error rejecting service:', error);
    res.status(500).json({ message: 'Error rejecting service', error: error.message });
  }
};
