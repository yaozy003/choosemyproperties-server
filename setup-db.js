const { Client } = require('pg');

async function setupDatabase() {
  // Connect to the default postgres database
  const client = new Client({
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    user: 'myuser',
    password: 'mysecretpassword',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const dbResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'mydatabase'"
    );
    
    if (dbResult.rows.length === 0) {
      console.log('Creating database mydatabase...');
      await client.query('CREATE DATABASE mydatabase');
      console.log('Database created successfully');
    } else {
      console.log('Database mydatabase already exists');
    }

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 