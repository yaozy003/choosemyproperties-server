const { PrismaClient } = require('../../src/generated/prisma')

const prisma = new PrismaClient();

// Export the Prisma client instance
module.exports = prisma; 