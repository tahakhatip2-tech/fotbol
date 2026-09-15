import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'tahakhatip@gmail.com';
  const password = 'taha@1982';

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found!');
    return;
  }

  console.log('User found:', user.email, 'Role:', user.role);
  if (user.passwordHash) {
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Is password valid?', isValid);
  } else {
    console.log('User has no passwordHash');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
