const express = require('express');
const prisma = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Register endpoint
const registerHandler = async (req, res, next) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;

    // Check if user already exists
    console.log('Checking if user exists with email:', email);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      console.log('User already exists with email:', email);
      res.status(400).json({ error: 'Registration failed. Please try again.' });
      return;
    }

    // Hash password using a different method
    console.log('Hashing password using crypto');
    try {
      // Use a simpler hashing method as a fallback
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      const finalHashedPassword = salt + ':' + hashedPassword;
      
      console.log('Password hashed successfully');
      
      // Create user
      console.log('Creating new user');
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: finalHashedPassword
        }
      });
      console.log('User created successfully:', user.id);

      // Create JWT token
      console.log('Creating JWT token');
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token
      });
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      console.error('Error details:', {
        message: hashError.message,
        stack: hashError.stack,
        code: hashError.code
      });
      throw hashError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error in registerHandler:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(400).json({ error: 'Registration failed. Please try again.' });
  }
};

// Login endpoint
const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password using the new method
    const [salt, hash] = user.password.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
    if (hash !== verifyHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile (protected route)
const getProfileHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile (protected route)
const updateProfileHandler = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email
      }
    });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Register routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/profile', authenticateToken, getProfileHandler);
router.put('/profile', authenticateToken, updateProfileHandler);

module.exports = router; 