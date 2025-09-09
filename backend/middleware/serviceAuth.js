import Service from '../models/Service.js';
import Tasker from '../models/Tasker.js';

// Middleware to check if the user owns the service
export const checkServiceOwnership = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.userId; // Fixed: use userId instead of id

    // Find the service
    const service = await Service.findById(serviceId).populate('taskerId');
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Check if the logged-in user owns this service
    if (service.taskerId.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only modify your own services.' 
      });
    }

    // Add service to request object for use in controllers
    req.service = service;
    next();
  } catch (error) {
    console.error('Error checking service ownership:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying service ownership',
      error: error.message 
    });
  }
};

// Middleware to check if user is a tasker
export const checkTaskerAccess = async (req, res, next) => {
  try {
    const { taskerId } = req.params;
    const userId = req.user.userId; // Fixed: use userId instead of id

    console.log('Debug - checkTaskerAccess:', {
      taskerId,
      userId,
      userFromToken: req.user
    });

    // Find the tasker
    const tasker = await Tasker.findById(taskerId);
    
    if (!tasker) {
      console.log('Debug - Tasker not found:', taskerId);
      return res.status(404).json({ 
        success: false,
        message: 'Tasker not found' 
      });
    }

    console.log('Debug - Found tasker:', {
      taskerUserId: tasker.userId.toString(),
      requestUserId: userId
    });

    // Check if the logged-in user is this tasker
    if (tasker.userId.toString() !== userId) {
      console.log('Debug - Access denied - User mismatch');
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only access your own tasker profile.' 
      });
    }

    console.log('Debug - Access granted');
    // Add tasker to request object for use in controllers
    req.tasker = tasker;
    next();
  } catch (error) {
    console.error('Error checking tasker access:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying tasker access',
      error: error.message 
    });
  }
};

// Middleware to check admin role (for future implementation)
export const checkAdminRole = (req, res, next) => {
  try {
    // Assuming user role is stored in the JWT token
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying admin access',
      error: error.message 
    });
  }
};
