import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, firstName: true }
  });
  console.log('All users:', users);

  // Ensure tahakhatip@gmail.com is ADMIN
  await prisma.user.updateMany({
    where: { email: 'tahakhatip@gmail.com' },
    data: { role: 'ADMIN' }
  });
  
  console.log('Updated tahakhatip@gmail.com to ADMIN (if exists).');
}

main().finally(() => prisma.$disconnect());
