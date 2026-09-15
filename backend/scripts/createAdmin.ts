import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'client@fotbol.com';
  const password = 'clientpassword123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'Client',
      role: 'ADMIN',
      wallet: {
        create: { balance: 0, lockedBalance: 0 }
      }
    },
  });

  console.log(`Admin created: ${admin.email}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
