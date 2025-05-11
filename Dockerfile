FROM node:20-alpine

WORKDIR /app

# Install netcat for the entrypoint script
RUN apk add --no-cache netcat-openbsd
RUN apk add --no-cache openssl

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

# Use the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"] 