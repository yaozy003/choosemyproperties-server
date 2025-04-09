const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, syncModels } = require('./models');
const routes = require('./routes');

// Load Env var
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
});

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.use('/api', routes);

// DB connection test
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection established successfully. Environment: ${process.env.NODE_ENV}`);
    
    // Sync models
    await syncModels();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  await testDbConnection();
}); 