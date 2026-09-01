import { PrismaClient, ShareRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@ajaia.test" },
    update: {},
    create: {
      email: "alice@ajaia.test",
      name: "Alice",
      password: passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@ajaia.test" },
    update: {},
    create: {
      email: "bob@ajaia.test",
      name: "Bob",
      password: passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "charlie@ajaia.test" },
    update: {},
    create: {
      email: "charlie@ajaia.test",
      name: "Charlie",
      password: passwordHash,
    },
  });

  const welcomeDoc = await prisma.document.upsert({
    where: { id: "seed-welcome-doc" },
    update: {},
    create: {
      id: "seed-welcome-doc",
      title: "Welcome to Ajaia Docs",
      ownerId: alice.id,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Create a new document or import a file to get started.",
              },
            ],
          },
        ],
      },
    },
  });

  await prisma.documentShare.upsert({
    where: {
      documentId_userId: {
        documentId: welcomeDoc.id,
        userId: bob.id,
      },
    },
    update: {},
    create: {
      documentId: welcomeDoc.id,
      userId: bob.id,
      role: ShareRole.EDITOR,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
