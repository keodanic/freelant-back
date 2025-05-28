import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // A ordem importa para evitar conflitos de chave estrangeira
  await prisma.message.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.service.deleteMany();
  await prisma.freelancer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workCategory.deleteMany();
}

main()
  .then(() => {
    console.log("Dados apagados com sucesso!");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
