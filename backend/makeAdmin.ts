import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = 'tahakhatip2@gmail.com';
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log('Success! User updated to ADMIN:', user.email, user.role);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
