import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  let user = await prisma.user.findFirst({ where: { role: 'USER' } });
  if (!user) {
    user = await prisma.user.findFirst();
  }
  if (!user) {
    console.log('No users at all!');
    return;
  }
  await prisma.walletTransaction.create({
    data: {
      userId: user.id,
      type: 'DEPOSIT',
      amount: 500,
      status: 'PENDING',
      details: JSON.stringify({ method: 'USDT TRC-20', receiptImage: 'dummy.jpg' })
    }
  });
  console.log('Created pending deposit for user:', user.email);
}
main().finally(() => prisma.$disconnect());
