const { Client } = require('pg');

async function setupDatabase() {
  // Connect to the default postgres database
  const client = new Client({
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    user: 'postgres',
    password: 'postgres', // Default password for postgres user
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if user exists
    const userResult = await client.query(
      "SELECT 1 FROM pg_roles WHERE rolname = 'myuser'"
    );
    
    if (userResult.rows.length === 0) {
      console.log('Creating user myuser...');
      await client.query("CREATE USER myuser WITH PASSWORD 'mysecretpassword'");
      console.log('User created successfully');
    } else {
      console.log('User myuser already exists');
    }

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

    // Grant privileges
    console.log('Granting privileges...');
    await client.query('GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser');
    console.log('Privileges granted successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 