import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // User Information (automatically filled from authentication)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Required for authenticated bookings
    index: true // Add index for faster queries
  },

  // Service Information (automatically filled from URL params)
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true, // Required for all bookings
    index: true // Add index for faster queries
  },

  // Essential Booking Information
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true
  },

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

  // Rating and Feedback
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },

  // Optional: Link to specific tasker
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
  
  // Timestamps
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
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
bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ assignedTasker: 1 });
bookingSchema.index({ userId: 1 });
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

// Static method to get bookings by status
bookingSchema.statics.getBookingsByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
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
    userId: this.userId,
    serviceDescription: this.serviceDescription,
    preferredDate: this.preferredDate,
    status: this.status,
    location: this.serviceLocation
  };
};

export default mongoose.model('Booking', bookingSchema);