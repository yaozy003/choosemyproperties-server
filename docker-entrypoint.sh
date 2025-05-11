#!/bin/sh

# Print environment variables for debugging
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: $DATABASE_URL"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Run the database setup script
echo "Setting up the database..."
node setup-db.js

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma db push

# Start the application
echo "Starting the application..."
exec "$@" 