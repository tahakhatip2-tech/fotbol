import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Increase transaction timeout to prevent P2024 errors under load
  transactionOptions: {
    timeout: 30000, // 30 seconds
    maxWait: 15000  // 15 seconds wait for connection
  }
});

export default prisma;
