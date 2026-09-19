const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearNotifications() {
  const result = await prisma.notification.deleteMany({});
  console.log('Cleared notifications:', result.count);
}

clearNotifications().finally(() => prisma.$disconnect());
