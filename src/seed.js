const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@melisfera.md' },
    update: {},
    create: {
      email: 'admin@melisfera.md',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Melisfera',
      role: 'admin',
    },
  });

  console.log('✓ Admin creat:', admin.email);
  console.log('✓ Parola: admin123');
  console.log('Seed finalizat!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());