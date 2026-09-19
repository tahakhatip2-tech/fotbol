const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
  const users = await prisma.user.findMany({ 
    where: { username: null, email: { not: null } } 
  });
  console.log(`Found ${users.length} users to update.`);
  for (const u of users) {
    const username = u.email.split('@')[0];
    try {
      await prisma.user.update({ where: { id: u.id }, data: { username } });
      console.log(`Updated ${u.email} to username ${username}`);
    } catch (e) {
      console.log(`Conflict or error for username ${username}`);
    }
  }
  console.log('Done');
}

update().finally(() => prisma.$disconnect());
