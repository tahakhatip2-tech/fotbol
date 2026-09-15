import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'tahakhatip@gmail.com';
  const password = 'taha@1982';

  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log('Admin user already exists!');
    // Just update the role and password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Updated existing user to ADMIN with new password.');
    return;
  }

  // Create new admin
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'Taha',
      role: 'ADMIN',
      wallet: {
        create: {
          balance: 0,
          lockedBalance: 0
        }
      }
    }
  });

  console.log('Admin account created successfully:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
