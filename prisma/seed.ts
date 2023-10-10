import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 30; i++) {
    await prisma.player.create({
      data: {
        name: faker.internet.userName(),
        teamName: faker.company.name(),
        salary: faker.finance.amount(),
        image: faker.image.url(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
