import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: hashSync('password'),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
