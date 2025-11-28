const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'News title is required'],
    trim: true,
    maxlength: 200
  },
  summary: { 
    type: String, 
    required: [true, 'News summary is required'],
    trim: true,
    maxlength: 500
  },
  content: { 
    type: String,
    trim: true
  },
  category: { 
    type: String, 
    enum: ['Achievements', 'Events', 'Facilities', 'Admissions', 'Announcements'],
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  imageUrl: { 
    type: String 
  },
  author: { 
    type: String, 
    default: 'Admin' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'published' 
  }
}, { 
  timestamps: true 
});

// Create index for better performance
newsSchema.index({ date: -1 });
newsSchema.index({ isFeatured: 1, status: 1 });

module.exports = mongoose.model('News', newsSchema);