const express = require('express');
const jwt = require('jsonwebtoken');
const { 
  loginLimiter, 
  validatePassword, 
  comparePassword 
} = require('../middleware/auth');
const Admin = require('../models/Admin');

const router = express.Router();

// Login route with enhanced security
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt:', { username }); // DEBUG

    // Input validation
    if (!username || !password) {
      console.log('❌ Missing credentials'); // DEBUG
      return res.status(400).json({
        error: 'Username and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    console.log('🔍 Looking for admin:', sanitizedUsername); // DEBUG

    if (sanitizedUsername.length < 3 || sanitizedPassword.length < 1) {
      return res.status(400).json({
        error: 'Invalid credentials format',
        code: 'INVALID_CREDENTIALS_FORMAT'
      });
    }

    // Find admin user
   const admin = await Admin.findOne({ 
  username: { $regex: new RegExp(`^${sanitizedUsername}$`, 'i') } 
});
    console.log('👤 Admin found:', !!admin); // DEBUG
    if (!admin) {
      // Use generic error message to prevent user enumeration
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        error: 'Account temporarily locked due to too many failed attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }


    console.log('🔑 Checking password...'); // DEBUG

    // Verify password with timing-safe comparison
    const isPasswordValid = await comparePassword(sanitizedPassword, admin.password);

    console.log('✅ Password valid:', isPasswordValid); // DEBUG

    if (!isPasswordValid) {
      // Increment failed login attempts
      await admin.incrementLoginAttempts();
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Reset login attempts on successful login
    await Admin.updateOne(
      { _id: admin._id }, 
      { 
        $set: { loginAttempts: 0, lastLogin: new Date() },
        $unset: { lockUntil: 1 }
      }
    );

    // Generate JWT token with enhanced security
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: process.env.JWT_ISSUER || 'epa-school-app',
        subject: admin._id.toString()
      }
    );

    // Secure cookie settings for production (optional - you can use localStorage instead)
    if (process.env.USE_HTTP_ONLY_COOKIES === 'true') {
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }

    res.json({
      message: 'Login successful',
      token: process.env.USE_HTTP_ONLY_COOKIES === 'true' ? undefined : token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during authentication',
      code: 'AUTHENTICATION_ERROR'
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logout successful' });
});

// Verify token route
router.get('/verify', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ valid: false });
    }
    
    res.json({ valid: true, admin: decoded });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;