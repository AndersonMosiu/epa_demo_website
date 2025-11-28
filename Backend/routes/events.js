const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const {authMiddleware} = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sanitizeInput, noSqlSanitize } = require('../middleware/sanitize');
const { generalLimiter } = require('../middleware/rateLimit');
const validateImageContent = require('../middleware/validateImage');
const { secureDeleteFile } = require('../middleware/fileUtils');
const path = require('path');
const fs = require('fs');

//  rate limiting and sanitization to all routes
router.use(generalLimiter);
router.use(noSqlSanitize);

// GET all events (public route)
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 }); // Sort by date ascending (soonest first)
    res.json(events);
  } catch (error) {
    console.error('Error loading events:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load events';
    res.status(500).json({ message });
  }
});

// GET upcoming events (public route)
router.get('/upcoming', sanitizeInput, async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ 
      date: { $gte: new Date() }, // Events from today onwards
      status: 'upcoming'
    })
    .sort({ date: 1 })
    .limit(10);

    res.json(upcomingEvents);
  } catch (error) {
    console.error('Error loading upcoming events:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load upcoming events';
    res.status(500).json({ message });
  }
});

// GET single event by ID (public route)
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error loading event:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load event';
    res.status(500).json({ message });
  }
});

// CREATE new event with image upload (protected route)
router.post('/', authMiddleware, upload.single('image'), validateImageContent, sanitizeInput, async (req, res) => {
  try {
    // Add server-side date validation
    const eventDate = new Date(req.body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      // Delete uploaded file if date is invalid
      if (req.file) {
        secureDeleteFile(req.file.path);
      }
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const eventData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      eventData.imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = new Event(eventData);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Delete uploaded file if there's an error
    if (req.file) {
      secureDeleteFile(req.file.path);
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: process.env.NODE_ENV === 'development' 
          ? Object.values(error.errors).map(e => e.message)
          : ['Please check your input data']
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to create event';
    res.status(400).json({ message });
  }
});

// UPDATE event with image upload (protected route)
router.put('/:id', authMiddleware, upload.single('image'), validateImageContent, sanitizeInput, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      // Delete uploaded file if event not found
      if (req.file) {
        secureDeleteFile(req.file.path);
      }
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate date if provided in update
    if (req.body.date) {
      const eventDate = new Date(req.body.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        // Delete uploaded file if date is invalid
        if (req.file) {
          secureDeleteFile(req.file.path);
        }
        return res.status(400).json({ message: 'Event date cannot be in the past' });
      }
    }

    const updateData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (event.imageUrl) {
        secureDeleteFile(event.imageUrl);
      }
      updateData.imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    
    // Delete uploaded file if there's an error
    if (req.file) {
      secureDeleteFile(req.file.path);
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: process.env.NODE_ENV === 'development' 
          ? Object.values(error.errors).map(e => e.message)
          : ['Please check your input data']
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to update event';
    res.status(400).json({ message });
  }
});

// DELETE event (protected route - also delete associated image)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Delete associated image
    if (event.imageUrl) {
      secureDeleteFile(event.imageUrl);
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to delete event';
    res.status(500).json({ message });
  }
});

// GET events by type (public route)
router.get('/type/:type', sanitizeInput, async (req, res) => {
  try {
    const events = await Event.find({ 
      type: req.params.type,
      status: 'upcoming'
    })
    .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Error loading events by type:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load events';
    res.status(500).json({ message });
  }
});

// GET events by audience (public route)
router.get('/audience/:audience', sanitizeInput, async (req, res) => {
  try {
    const events = await Event.find({ 
      $or: [
        { audience: req.params.audience },
        { audience: 'all' }
      ],
      status: 'upcoming'
    })
    .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Error loading events by audience:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load events';
    res.status(500).json({ message });
  }
});

module.exports = router;