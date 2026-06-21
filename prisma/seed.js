import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.trade.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'John Doe',
      password: 'hashed_password_here',
      role: 'user',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_here',
      role: 'user',
    },
  });

  await prisma.trade.create({
    data: {
      userId: user1.id,
      symbol: 'AAPL',
      type: 'BUY',
      quantity: 10,
      price: 150.25,
      status: 'COMPLETED',
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
