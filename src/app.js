const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./models');
const routes = require('./routes/index.js');

// Load Env var
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

// Log environment variables for debugging
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? '***' : undefined // Mask the URL for security
});

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// route
app.use('/api', routes);
app.use('/auth', require('./routes/auth.js'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// DB connection test
const testDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log(`Database connection established successfully. Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't exit the process, just log the error
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  await testDbConnection();
}); 