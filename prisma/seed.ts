import { PrismaClient } from "@prisma/client";
import { students } from "../server/sample/student";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction([
    prisma.schools.create({
      data: {
        id: 1,
        name: "sample",
      },
    }),
    ...Object.keys(students).map((classNumber) =>
      prisma.rooms.create({
        data: {
          school: {
            connect: {
              id: 1,
            },
          },
          year: 2023,
          name: `${classNumber}組`,
          students: {
            create: students[classNumber],
          },
        },
      }),
    ),
  ]);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
