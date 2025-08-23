import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@mail.com' },
  });

  if (existingAdmin) {
    console.log('Admin already exists, skipping seed...');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create default admin
  const admin = await prisma.admin.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@mail.com',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      password: hashedPassword,
    },
  });

  console.log(`Created admin with id: ${admin.id}`);
  console.log('Email: admin@mail.com');
  console.log('Password: admin123');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });