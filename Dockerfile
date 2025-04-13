FROM node:16-alpine

WORKDIR /app

# Install netcat for the entrypoint script
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . .

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

# Use the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"] 