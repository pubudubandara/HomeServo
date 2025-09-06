import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Tasker from '../models/Tasker.js';
import User from '../models/User.js';

// Create a new booking
const createBooking = async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    
    const {
      customerPhone,
      serviceDescription,
      serviceLocation,
      preferredDate,
      serviceId,
      customerNotes,
      userId
    } = req.body;

    console.log('Extracted fields:', {
      customerPhone,
      serviceDescription,
      serviceLocation,
      preferredDate,
      userId,
      serviceId,
      hasUserId: !!userId,
      hasServiceId: !!serviceId,
      userIdType: typeof userId,
      serviceIdType: typeof serviceId
    });

    // Validate required fields
    if (!customerPhone || !serviceDescription || !serviceLocation || !preferredDate || !serviceId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including user ID and service ID',
        missingFields: {
          customerPhone: !customerPhone,
          serviceDescription: !serviceDescription,
          serviceLocation: !serviceLocation,
          preferredDate: !preferredDate,
          serviceId: !serviceId,
          userId: !userId
        }
      });
    }

    // Validate userId format if provided
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID format:', userId);
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if user exists
    if (userId) {
      try {
        const userExists = await User.findById(userId);
        if (!userExists) {
          console.log('User not found:', userId);
          return res.status(400).json({
            success: false,
            message: 'User not found. Please log in again.'
          });
        }
        console.log('User found:', userExists.email);
      } catch (userError) {
        console.log('Error checking user:', userError.message);
        return res.status(400).json({
          success: false,
          message: 'Error validating user'
        });
      }
    }

    // Validate serviceId format if provided
    if (serviceId && !mongoose.Types.ObjectId.isValid(serviceId.trim())) {
      console.log('Invalid service ID format:', serviceId);
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }

    // Check if service exists
    if (serviceId) {
      try {
        const serviceExists = await Service.findById(serviceId.trim());
        if (!serviceExists) {
          console.log('Service not found:', serviceId);
          return res.status(400).json({
            success: false,
            message: 'Service not found. Please select a valid service.'
          });
        }
        console.log('Service found:', serviceExists.title);
      } catch (serviceError) {
        console.log('Error checking service:', serviceError.message);
        return res.status(400).json({
          success: false,
          message: 'Error validating service'
        });
      }
    }

    // Validate date is in the future
    const selectedDate = new Date(preferredDate);
    const currentDate = new Date();
    console.log('Preferred date received:', preferredDate);
    console.log('Parsed date:', selectedDate);
    console.log('Current date:', currentDate);
    
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please provide a valid date.'
      });
    }

    // Allow dates from today onwards (more flexible validation)
    const todayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    if (selectedDate < todayStart) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date cannot be in the past'
      });
    }

    // Create booking object
    const bookingData = {
      userId: userId, // Always required now
      serviceId: serviceId.trim(),
      customerPhone: customerPhone.trim(),
      serviceDescription: serviceDescription.trim(),
      serviceLocation: serviceLocation.trim(),
      preferredDate: selectedDate,
      customerNotes: customerNotes?.trim() || '',
      status: 'pending',
      priority: 'medium'
    };

    console.log('Booking data with required userId and serviceId:', bookingData);

    console.log('Booking data prepared:', bookingData);

    // Add service reference if provided
    if (serviceId) {
      try {
        // Validate if serviceId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
          console.log('Invalid service ID format:', serviceId);
        } else {
          const service = await Service.findById(serviceId);
          if (service) {
            bookingData.serviceId = serviceId;
            // Optionally set estimated cost based on service price
            if (service.price) {
              const priceMatch = service.price.match(/\d+/);
              if (priceMatch) {
                bookingData.estimatedCost = parseInt(priceMatch[0]);
              }
            }
            console.log('Service found and linked to booking:', service.title);
          } else {
            console.log('Service ID provided but service not found:', serviceId);
          }
        }
      } catch (serviceError) {
        console.log('Error fetching service:', serviceError.message);
        // Continue with booking creation even if service lookup fails
      }
    }

    // Create the booking
    console.log('Creating booking with data:', bookingData);
    const booking = new Booking(bookingData);
    console.log('Booking object created, now saving...');
    await booking.save();
    console.log('Booking saved successfully with ID:', booking._id);

    // Populate service details if available
    let serviceInfo = null;
    if (booking.serviceId) {
      console.log('Populating service details...');
      try {
        const service = await Service.findById(booking.serviceId).select('title category price');
        serviceInfo = service ? {
          id: service._id,
          title: service.title,
          category: service.category,
          price: service.price
        } : null;
      } catch (populateError) {
        console.log('Error populating service:', populateError.message);
      }
    }

    console.log('Preparing response...');
    const responseData = {
      bookingId: booking._id,
      status: booking.status,
      priority: booking.priority,
      preferredDate: booking.preferredDate,
      service: serviceInfo
    };

    // Only add estimatedDuration if the method exists
    try {
      if (typeof booking.getEstimatedDuration === 'function') {
        responseData.estimatedDuration = booking.getEstimatedDuration();
      }
    } catch (durationError) {
      console.log('Error getting estimated duration:', durationError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! We will contact you soon to confirm the details.',
      data: responseData
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category price')
      .populate('assignedTasker', 'firstName lastName email phoneNumber')
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBookings,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('serviceId', 'title category price description')
      .populate('assignedTasker', 'firstName lastName email phoneNumber profileImage bio');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTasker, scheduledDate, estimatedCost, actualCost, adminNotes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    if (status) booking.status = status;
    if (assignedTasker) booking.assignedTasker = assignedTasker;
    if (scheduledDate) booking.scheduledDate = new Date(scheduledDate);
    if (estimatedCost !== undefined) booking.estimatedCost = estimatedCost;
    if (actualCost !== undefined) booking.actualCost = actualCost;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;

    // Set completion date if status is completed
    if (status === 'completed' && !booking.completedDate) {
      booking.completedDate = new Date();
    }

    await booking.save();

    // Populate updated booking
    await booking.populate('serviceId', 'title category price');
    await booking.populate('assignedTasker', 'firstName lastName email phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get booking statistics (Admin only)
const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          urgentBookings: {
            $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
          },
          averageRating: { $avg: '$customerRating' },
          totalRevenue: { $sum: '$actualCost' }
        }
      }
    ]);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('serviceId', 'title category')
      .select('customerPhone serviceDescription status createdAt priority');

    const urgentBookings = await Booking.getUrgentBookings().limit(10);

    res.status(200).json({
      success: true,
      data: {
        statistics: stats[0] || {
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          urgentBookings: 0,
          averageRating: 0,
          totalRevenue: 0
        },
        recentBookings,
        urgentBookings
      }
    });

  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add customer rating and feedback
const addBookingFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }

    booking.customerRating = rating;
    if (feedback) booking.customerFeedback = feedback.trim();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        rating: booking.customerRating,
        feedback: booking.customerFeedback
      }
    });

  } catch (error) {
    console.error('Error adding booking feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get bookings for a specific tasker
const getTaskerBookings = async (req, res) => {
  try {
    const { taskerId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    console.log(`Fetching bookings for tasker: ${taskerId}`);

    // Validate tasker exists
    const tasker = await Tasker.findById(taskerId);
    if (!tasker) {
      return res.status(404).json({
        success: false,
        message: 'Tasker not found'
      });
    }

    // Get all services created by this tasker
    const taskerServices = await Service.find({ taskerId }).select('_id title');
    const serviceIds = taskerServices.map(service => service._id);
    
    console.log(`Found ${taskerServices.length} services for tasker:`, serviceIds);

    // Build query for bookings based on services owned by this tasker
    let query = { serviceId: { $in: serviceIds } };
    
    if (status) {
      query.status = status;
    }

    console.log('Booking query:', query);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category price description taskerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`Found ${bookings.length} bookings`);

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(query);

    // Calculate booking statistics for this tasker
    const stats = {
      total: totalBookings,
      pending: await Booking.countDocuments({ serviceId: { $in: serviceIds }, status: 'pending' }),
      confirmed: await Booking.countDocuments({ serviceId: { $in: serviceIds }, status: 'confirmed' }),
      inProgress: await Booking.countDocuments({ serviceId: { $in: serviceIds }, status: 'in-progress' }),
      completed: await Booking.countDocuments({ serviceId: { $in: serviceIds }, status: 'completed' }),
      cancelled: await Booking.countDocuments({ serviceId: { $in: serviceIds }, status: 'cancelled' })
    };

    console.log('Booking stats:', stats);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBookings / limit),
          totalBookings,
          hasNext: skip + bookings.length < totalBookings,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching tasker bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasker bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get bookings for a specific service
const getServiceBookings = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Validate service exists
    const service = await Service.findById(serviceId).populate('taskerId');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Build query
    let query = { serviceId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get bookings
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        service: {
          id: service._id,
          title: service.title,
          category: service.category,
          tasker: service.taskerId
        },
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBookings / limit),
          totalBookings,
          hasNext: skip + bookings.length < totalBookings,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching service bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create test bookings for development
const createTestBookings = async (req, res) => {
  try {
    // Get a tasker and their services
    const tasker = await Tasker.findOne();
    if (!tasker) {
      return res.status(400).json({
        success: false,
        message: 'No tasker found. Please create a tasker first.'
      });
    }

    const services = await Service.find({ taskerId: tasker._id }).limit(3);
    if (services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No services found for the tasker. Please create services first.'
      });
    }

    const testBookings = [];
    
    // Create bookings for different services
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const booking = {
        userId: users[Math.floor(Math.random() * users.length)]._id, // Random user from test users
        customerPhone: `+123456789${i}`,
        serviceDescription: `Test booking for ${service.title} - ${service.description}`,
        serviceLocation: `Test Location ${i + 1}, Test City`,
        preferredDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000), // i+1 days from now
        serviceId: service._id,
        status: i === 0 ? 'pending' : i === 1 ? 'confirmed' : 'completed',
        estimatedCost: 50 + (i * 25)
      };
      testBookings.push(booking);
    }

    const createdBookings = await Booking.insertMany(testBookings);

    res.status(201).json({
      success: true,
      message: `Created ${createdBookings.length} test bookings`,
      data: {
        tasker: {
          id: tasker._id,
          name: `${tasker.firstName} ${tasker.lastName}`
        },
        bookings: createdBookings
      }
    });

  } catch (error) {
    console.error('Error creating test bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get bookings by user ID
const getCustomerBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    let userObjectId = userId;

    // Check if userId is an email (contains @) or an ObjectId
    if (userId.includes('@')) {
      // It's an email, find the user by email first
      const user = await User.findOne({ email: userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      userObjectId = user._id;
    } else {
      // It's an ObjectId, validate it
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
      }
    }

    const bookings = await Booking.find({ userId: userObjectId })
      .populate('serviceId', 'title description category')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: `Found ${bookings.length} bookings for user`,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  addBookingFeedback,
  getTaskerBookings,
  getServiceBookings,
  getCustomerBookings,
  createTestBookings
};
