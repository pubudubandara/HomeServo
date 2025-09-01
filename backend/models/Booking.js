import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guest bookings
    index: true // Add index for faster queries
  },
  
  // Service Information
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true, // Make service ID required
    index: true // Add index for faster queries
  },
  
  // Customer Information
  customerName: {
    type: String,
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  customerEmail: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true
  },
  
  // Service Information
  serviceDescription: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [1000, 'Service description cannot exceed 1000 characters']
  },
  serviceLocation: {
    type: String,
    required: [true, 'Service location is required'],
    trim: true,
    maxlength: [200, 'Service location cannot exceed 200 characters']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred service date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Preferred date must be in the future'
    }
  },
  
  // Booking Status and Management
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Optional: Link to specific service and tasker
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false
  },
  assignedTasker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasker',
    required: false
  },
  
  // Admin and Management Fields
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  adminNotes: {
    type: String,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  customerNotes: {
    type: String,
    maxlength: [500, 'Customer notes cannot exceed 500 characters']
  },
  
  // Timestamps
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  
  // Rating and Feedback
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  customerFeedback: {
    type: String,
    maxlength: [1000, 'Customer feedback cannot exceed 1000 characters']
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'digital_wallet'],
    required: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ assignedTasker: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for booking age in days
bookingSchema.virtual('bookingAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days until preferred date
bookingSchema.virtual('daysUntilService').get(function() {
  return Math.floor((this.preferredDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to set priority based on preferred date
bookingSchema.pre('save', function(next) {
  if (this.isNew && this.preferredDate) {
    const daysUntilService = Math.floor((this.preferredDate - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilService <= 1) {
      this.priority = 'urgent';
    } else if (daysUntilService <= 3) {
      this.priority = 'high';
    } else if (daysUntilService <= 7) {
      this.priority = 'medium';
    } else {
      this.priority = 'low';
    }
  }
  next();
});

// Static method to get bookings by status
bookingSchema.statics.getBookingsByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get urgent bookings
bookingSchema.statics.getUrgentBookings = function() {
  return this.find({ 
    priority: 'urgent',
    status: { $in: ['pending', 'confirmed'] }
  }).sort({ preferredDate: 1 });
};

// Instance method to calculate estimated duration
bookingSchema.methods.getEstimatedDuration = function() {
  // Default estimation logic - can be enhanced based on service type
  const descriptionLength = this.serviceDescription.length;
  if (descriptionLength > 500) return '4-6 hours';
  if (descriptionLength > 200) return '2-4 hours';
  return '1-2 hours';
};

// Instance method to format booking for customer notification
bookingSchema.methods.toCustomerNotification = function() {
  return {
    bookingId: this._id,
    customerName: this.customerName,
    serviceDescription: this.serviceDescription,
    preferredDate: this.preferredDate,
    status: this.status,
    location: this.serviceLocation
  };
};

export default mongoose.model('Booking', bookingSchema);
