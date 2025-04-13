const express = require('express');
const authRoutes = require('./auth');
const mainRoutes = require('./main');

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/', mainRoutes);

module.exports = router; 