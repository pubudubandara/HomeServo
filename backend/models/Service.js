import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  taskerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tasker', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Assembly', 'Mounting', 'Moving', 'Cleaning', 'Outdoor Help', 'Home Repairs', 'Painting']
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  price: { 
    type: String, 
    required: true
  },
  image: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String,
    trim: true 
  }],
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },
  state: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  jobsCompleted: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  reviewedAt: { 
    type: Date 
  },
  reviewNotes: { 
    type: String,
    maxlength: 500
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
ServiceSchema.index({ taskerId: 1 });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ state: 1 });
ServiceSchema.index({ status: 1 });

// Virtual for formatted creation date
ServiceSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString() : 'N/A';
});

// Ensure virtual fields are serialized only when needed
ServiceSchema.set('toJSON', { 
  virtuals: false,  // Disable virtuals to prevent errors
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
