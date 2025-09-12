import Service from '../models/Service.js';
import Tasker from '../models/Tasker.js';

// Get all services for a specific tasker
export const getTaskerServices = async (req, res) => {
  try {
    const { taskerId } = req.params;
    
    // Verify tasker exists
    const tasker = await Tasker.findById(taskerId);
    if (!tasker) {
      return res.status(404).json({ message: 'Tasker not found' });
    }

    const services = await Service.find({ taskerId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching tasker services:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching services',
      error: error.message 
    });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { taskerId } = req.params;
    const { title, category, description, price, image, tags } = req.body;

    // Verify tasker exists
    const tasker = await Tasker.findById(taskerId);
    if (!tasker) {
      return res.status(404).json({ message: 'Tasker not found' });
    }

    // Validate required fields
    if (!title || !category || !description || !price || !image) {
      return res.status(400).json({ 
        success: false,
        message: 'All required fields must be provided' 
      });
    }

    // Create new service
    const newService = new Service({
      taskerId,
      title: title.trim(),
      category,
      description: description.trim(),
      price: price.trim(),
      image,
      tags: tags ? tags.map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      status: 'inactive', // Default status
      state: 'pending' // Default state for admin review
    });

    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully. Awaiting admin approval.',
      data: savedService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating service',
      error: error.message 
    });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { title, category, description, price, image, tags } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Update service fields
    if (title) service.title = title.trim();
    if (category) service.category = category;
    if (description) service.description = description.trim();
    if (price) service.price = price.trim();
    if (image) service.image = image;
    if (tags) service.tags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

    // Reset to pending state if the service was previously approved
    if (service.state === 'approved') {
      service.state = 'pending';
      service.status = 'inactive';
      service.reviewedAt = null;
      service.reviewNotes = '';
      service.reviewedBy = null;
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: service.state === 'pending' ? 'Service updated. Changes will be reviewed by admin.' : 'Service updated successfully.',
      data: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating service',
      error: error.message 
    });
  }
};

// Toggle service status (active/inactive)
export const toggleServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Only allow status toggle if service is approved
    if (service.state !== 'approved') {
      return res.status(403).json({ 
        success: false,
        message: 'Service must be approved by admin before it can be activated' 
      });
    }

    // Toggle status
    service.status = service.status === 'active' ? 'inactive' : 'active';
    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: updatedService
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating service status',
      error: error.message 
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    await Service.findByIdAndDelete(serviceId);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting service',
      error: error.message 
    });
  }
};

// Get service statistics for a tasker
export const getServiceStats = async (req, res) => {
  try {
    const { taskerId } = req.params;

    const services = await Service.find({ taskerId });
    
    const stats = {
      total: services.length,
      active: services.filter(s => s.status === 'active' && s.state === 'approved').length,
      pending: services.filter(s => s.state === 'pending').length,
      approved: services.filter(s => s.state === 'approved').length,
      rejected: services.filter(s => s.state === 'rejected').length,
      totalJobs: services.reduce((sum, s) => sum + s.jobsCompleted, 0),
      averageRating: services.length > 0 
        ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
        : '0.0'
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching service statistics',
      error: error.message 
    });
  }
};

// Admin functions (for future implementation)

// Get all services for admin review
export const getAllServicesForAdmin = async (req, res) => {
  try {
    const { state, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (state) query.state = state;

    const services = await Service.find(query)
      .populate('taskerId', 'userId')
      .populate({
        path: 'taskerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: services.length,
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching services for admin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching services',
      error: error.message 
    });
  }
};

// Admin approve/reject service
export const adminReviewService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { state, reviewNotes } = req.body;
    const adminId = req.user.userId; // Fixed: use userId instead of id

    if (!['approved', 'rejected'].includes(state)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid state. Must be "approved" or "rejected"' 
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Update service state
    service.state = state;
    service.reviewedAt = new Date();
    service.reviewNotes = reviewNotes || '';
    service.reviewedBy = adminId;

    // If approved, service can be activated by tasker
    // If rejected, ensure it's inactive
    if (state === 'rejected') {
      service.status = 'inactive';
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${state} successfully`,
      data: updatedService
    });
  } catch (error) {
    console.error('Error reviewing service:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error reviewing service',
      error: error.message 
    });
  }
};

// Get all active and approved services for users to browse
export const getPublicServices = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    
    // Build query for active and approved services only
    const query = {
      status: 'active',
      state: 'approved'
    };

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    let services;
    let total;

    if (search) {
      // Use aggregation pipeline for searching in populated fields
      const aggregationPipeline = [
        {
          $match: query
        },
        {
          $lookup: {
            from: 'taskers',
            localField: 'taskerId',
            foreignField: '_id',
            as: 'tasker'
          }
        },
        {
          $unwind: '$tasker'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tasker.userId',
            foreignField: '_id',
            as: 'tasker.user'
          }
        },
        {
          $unwind: '$tasker.user'
        },
        {
          $match: {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { tags: { $in: [new RegExp(search, 'i')] } },
              { 'tasker.user.name': { $regex: search, $options: 'i' } },
              { 'tasker.city': { $regex: search, $options: 'i' } },
              { 'tasker.stateProvince': { $regex: search, $options: 'i' } },
              { 'tasker.country': { $regex: search, $options: 'i' } },
              { 'tasker.addressLine1': { $regex: search, $options: 'i' } },
              { 'tasker.addressLine2': { $regex: search, $options: 'i' } }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ];

      services = await Service.aggregate(aggregationPipeline);
      total = await Service.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'taskers',
            localField: 'taskerId',
            foreignField: '_id',
            as: 'tasker'
          }
        },
        {
          $unwind: '$tasker'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tasker.userId',
            foreignField: '_id',
            as: 'tasker.user'
          }
        },
        {
          $unwind: '$tasker.user'
        },
        {
          $match: {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { tags: { $in: [new RegExp(search, 'i')] } },
              { 'tasker.user.name': { $regex: search, $options: 'i' } },
              { 'tasker.city': { $regex: search, $options: 'i' } },
              { 'tasker.stateProvince': { $regex: search, $options: 'i' } },
              { 'tasker.country': { $regex: search, $options: 'i' } },
              { 'tasker.addressLine1': { $regex: search, $options: 'i' } },
              { 'tasker.addressLine2': { $regex: search, $options: 'i' } }
            ]
          }
        },
        { $count: "total" }
      ]);
      total = total.length > 0 ? total[0].total : 0;
    } else {
      services = await Service.find(query)
        .populate({
          path: 'taskerId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await Service.countDocuments(query);
    }

    // Get booking statistics for each service
    const servicesWithStats = await Promise.all(
      services.map(async (service) => {
        try {
          // Import Booking model dynamically to avoid circular imports
          const Booking = (await import('../models/Booking.js')).default;
          
          // Get all bookings for this service that are completed
          const completedBookings = await Booking.find({
            serviceId: service._id,
            status: 'completed'
          });

          // Calculate average rating
          const ratings = completedBookings
            .map(booking => booking.rating)
            .filter(rating => rating !== null && rating !== undefined);

          const averageRating = ratings.length > 0 
            ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
            : 0;

          // Count completed jobs
          const jobsCompleted = completedBookings.length;

          // Handle different service structures (aggregation vs populate)
          const isAggregated = service.tasker && service.tasker.user;
          const taskerData = isAggregated ? service.tasker : service.taskerId;
          const userData = isAggregated ? service.tasker.user : service.taskerId?.userId;

          return {
            id: service._id,
            name: service.title,
            description: service.description,
            price: service.price,
            image: service.image,
            category: service.category,
            tags: service.tags,
            rating: parseFloat(averageRating),
            jobsCompleted: jobsCompleted,
            tasker: taskerData ? {
              id: taskerData._id,
              firstName: userData?.name?.split(' ')[0] || '',
              lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
              name: userData?.name || '',
              email: userData?.email || ''
            } : null
          };
        } catch (error) {
          console.error(`Error calculating stats for service ${service._id}:`, error);
          // Return service with default values if stats calculation fails
          // Handle different service structures (aggregation vs populate)
          const isAggregated = service.tasker && service.tasker.user;
          const taskerData = isAggregated ? service.tasker : service.taskerId;
          const userData = isAggregated ? service.tasker.user : service.taskerId?.userId;

          return {
            id: service._id,
            name: service.title,
            description: service.description,
            price: service.price,
            image: service.image,
            category: service.category,
            tags: service.tags,
            rating: 0,
            jobsCompleted: 0,
            tasker: taskerData ? {
              id: taskerData._id,
              firstName: userData?.name?.split(' ')[0] || '',
              lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
              name: userData?.name || '',
              email: userData?.email || ''
            } : null
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: servicesWithStats,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: services.length,
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error fetching public services:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching services',
      error: error.message 
    });
  }
};

// Get single service with detailed tasker information (for profile page)
export const getServiceProfile = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId)
      .populate({
        path: 'taskerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    // Only show approved and active services to public
    if (service.status !== 'active' || service.state !== 'approved') {
      return res.status(404).json({ 
        success: false,
        message: 'Service not available' 
      });
    }

    // Get other services from the same tasker
    const otherServices = await Service.find({
      taskerId: service.taskerId._id,
      _id: { $ne: serviceId },
      status: 'active',
      state: 'approved'
    }).limit(3);

    // Transform data for frontend
    const transformedService = {
      id: service._id,
      title: service.title,
      description: service.description,
      price: service.price,
      image: service.image,
      category: service.category,
      rating: service.rating || 4.5,
      jobsCompleted: service.jobsCompleted || 12,
      tags: service.tags,
      createdAt: service.createdAt,
      tasker: {
        id: service.taskerId._id,
        firstName: service.taskerId.userId?.name?.split(' ')[0] || '',
        lastName: service.taskerId.userId?.name?.split(' ').slice(1).join(' ') || '',
        name: service.taskerId.userId?.name || '',
        email: service.taskerId.userId?.email || '',
        profileImage: service.taskerId.profileImageUrl,
        phoneNumber: service.taskerId.phoneNumber,
        location: {
          addressLine1: service.taskerId.addressLine1,
          addressLine2: service.taskerId.addressLine2,
          city: service.taskerId.city,
          stateProvince: service.taskerId.stateProvince,
          postalCode: service.taskerId.postalCode,
          country: service.taskerId.country
        },
        hourlyRate: service.taskerId.hourlyRate,
        experience: service.taskerId.experience,
        bio: service.taskerId.bio,
        skills: service.taskerId.skills,
        category: service.taskerId.category
      },
      otherServices: otherServices.map(s => ({
        id: s._id,
        title: s.title,
        price: s.price,
        image: s.image,
        category: s.category
      }))
    };

    res.json({
      success: true,
      data: transformedService
    });
  } catch (error) {
    console.error('Error fetching service profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching service details',
      error: error.message 
    });
  }
};
