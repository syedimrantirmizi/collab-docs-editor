import { prisma } from "@/lib/db";

const ownedDocumentSelect = {
  id: true,
  title: true,
  updatedAt: true,
  owner: {
    select: {
      name: true,
    },
  },
} as const;

export async function listOwnedDocumentsForUser(userId: string) {
  return prisma.document.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: ownedDocumentSelect,
  });
}

export async function getDashboardDocuments(userId: string) {
  const [owned, shared] = await Promise.all([
    listOwnedDocumentsForUser(userId),
    prisma.document.findMany({
      where: {
        shares: { some: { userId } },
        NOT: { ownerId: userId },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        owner: { select: { name: true } },
        shares: {
          where: { userId },
          select: { role: true },
        },
      },
    }),
  ]);

  return { owned, shared };
}
