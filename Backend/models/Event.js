const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: { 
    type: Date, 
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Event date cannot be in the past'
    }
  },
  time: { 
    type: String, 
    required: [true, 'Event time is required'],
    trim: true
  },
  location: { 
    type: String, 
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  type: { 
    type: String, 
    enum: {
      values: ['academic', 'sports', 'event', 'cultural'],
      message: 'Type must be academic, sports, event, or cultural'
    },
    required: true 
  },
  audience: { 
    type: String, 
    enum: {
      values: ['students', 'parents', 'staff', 'all'],
      message: 'Audience must be students, parents, staff, or all'
    }, 
    default: 'all' 
  },
  registrationRequired: { 
    type: Boolean, 
    default: false 
  },
  registrationLink: { 
    type: String,
    validate: {
      validator: function(value) {
        if (!this.registrationRequired) return true;
        return /^https?:\/\/.+\..+/.test(value);
      },
      message: 'Registration link is required when registration is required'
    }
  },
  imageUrl: { 
    type: String
  },
  status: { 
    type: String, 
    enum: {
      values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      message: 'Status must be upcoming, ongoing, completed, or cancelled'
    }, 
    default: 'upcoming' 
  }
}, { 
  timestamps: true 
});

// Create index for better performance
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ type: 1, status: 1 });

// Middleware to update status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (this.status === 'upcoming' && eventDate <= now) {
    this.status = 'ongoing';
  } else if (this.status === 'ongoing' && eventDate < now.setDate(now.getDate() - 1)) {
    this.status = 'completed';
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema);