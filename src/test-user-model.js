const { User, sequelize, syncModels } = require('./models');
const bcrypt = require('bcrypt');

async function testUserModel() {
  try {
    // Sync models
    await syncModels();
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    console.log('User created successfully:', user.toJSON());
    
    // Find the user
    const foundUser = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('User found:', foundUser ? foundUser.toJSON() : 'Not found');
    
    // Clean up
    await user.destroy();
    console.log('Test user deleted');
    
    // Close the connection
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error testing User model:', error);
  }
}

testUserModel(); 