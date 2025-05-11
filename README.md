# Choose My Properties Server

A Node.js backend server with PostgreSQL database for the Choose My Properties application.

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm (Node Package Manager)

## Project Structure

```
.
├── src/                    # Source code
├── docker-compose.yml      # Docker compose configuration
├── Dockerfile             # Docker configuration
├── package.json           # Node.js dependencies
├── setup-db.js           # Database setup script
└── create_tables.sql     # SQL schema
```

## Environment Setup

The project uses different environment configurations:
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## Running the Project

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd choosemyproperties-server
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up
   ```

This will start:
- Node.js server on port 3001
- PostgreSQL database on port 5432
- pgAdmin on port 5050

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the environment:
   - Copy `.env.development` to `.env`
   - Update the environment variables as needed

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run staging` - Start staging server
- `npm run prod` - Start production server
- `npm start` - Start server with default configuration

## Database Access

- PostgreSQL is accessible on `localhost:5432`
- Default credentials:
  - Username: myuser
  - Password: mysecretpassword
  - Database: mydatabase

- pgAdmin is accessible at `http://localhost:5050`
  - Email: admin@example.com
  - Password: adminpassword

## API Documentation

[Add API documentation here]

## License

[Add license information here]