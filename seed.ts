import PrismaClientSingleton from "./src/common/class/PrismaClientSingleton";
import { Prisma } from "@prisma/client";

async function main() {
  const prisma = PrismaClientSingleton.getInstance();

  const tableNames = Object.values(Prisma.ModelName);

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
    );
  }

  await prisma.member.createMany({
    data: [
      {
        code: "M001",
        name: "Angga",
      },
      {
        code: "M002",
        name: "Ferry",
      },
      {
        code: "M003",
        name: "Putri",
      },
    ],
  });

  await prisma.book.createMany({
    data: [
      {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1,
      },
      {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 1,
      },
      {
        code: "TW-11",
        title: "Twilight",
        author: "Stephenie Meyer",
        stock: 1,
      },
      {
        code: "HOB-83",
        title: "The Hobbit, or There and Back Again",
        author: "J.R.R. Tolkien",
        stock: 1,
      },
      {
        code: "NRN-7",
        title: "The Lion, the Witch and the Wardrobe",
        author: "C.S. Lewis",
        stock: 1,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Successfully seeding the database!");
  })
  .catch((error) => {
    console.error("Error while seeding: ", error);
  });
