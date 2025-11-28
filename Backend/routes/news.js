const express = require('express');
const router = express.Router();
const News = require('../models/News');
const {authMiddleware} = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sanitizeInput, noSqlSanitize } = require('../middleware/sanitize');
const { generalLimiter } = require('../middleware/rateLimit');
const validateImageContent = require('../middleware/validateImage');
const { secureDeleteFile } = require('../middleware/fileUtils');
const path = require('path');
const fs = require('fs');

// Apply rate limiting and sanitization to all routes
router.use(generalLimiter);
router.use(noSqlSanitize);

// GET all published news (public route)
router.get('/', sanitizeInput, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({ status: 'published' })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({ status: 'published' });

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNews: total
    });
  } catch (error) {
    console.error('Error loading news:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load news';
    res.status(500).json({ message });
  }
});

// GET featured news (public route)
router.get('/featured', sanitizeInput, async (req, res) => {
  try {
    const featuredNews = await News.find({ 
      isFeatured: true, 
      status: 'published' 
    })
    .sort({ date: -1 })
    .limit(3);

    res.json(featuredNews);
  } catch (error) {
    console.error('Error loading featured news:', error);
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load featured news';
    res.status(500).json({ message });
  }
});

// GET single news by ID (public route)
router.get('/:id', sanitizeInput, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error loading news item:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid news ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to load news';
    res.status(500).json({ message });
  }
});

// CREATE new news with image upload (protected route)
router.post('/', authMiddleware, upload.single('image'), validateImageContent, sanitizeInput, async (req, res) => {
  try {
    const newsData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      newsData.imageUrl = `/uploads/news/${req.file.filename}`;
    }
    
    const news = new News(newsData);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news:', error);
    
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
      : 'Failed to create news';
    res.status(400).json({ message });
  }
});

// UPDATE news with image upload (protected route)
router.put('/:id', authMiddleware, upload.single('image'), validateImageContent, sanitizeInput, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      // Delete uploaded file if news not found
      if (req.file) {
        secureDeleteFile(req.file.path);
      }
      return res.status(404).json({ message: 'News not found' });
    }

    const updateData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (news.imageUrl) {
        secureDeleteFile(news.imageUrl);
      }
      updateData.imageUrl = `/uploads/news/${req.file.filename}`;
    }
    
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    
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
      return res.status(400).json({ message: 'Invalid news ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to update news';
    res.status(400).json({ message });
  }
});

// DELETE news (protected route - also delete associated image)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Delete associated image
    if (news.imageUrl) {
      secureDeleteFile(news.imageUrl);
    }
    
    await News.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid news ID format' });
    }
    
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to delete news';
    res.status(500).json({ message });
  }
});

module.exports = router;