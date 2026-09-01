import { prisma } from "@/lib/db";

function titleSearchFilter(query?: string | null) {
  const trimmed = query?.trim();

  if (!trimmed) {
    return {};
  }

  return {
    title: {
      contains: trimmed,
      mode: "insensitive" as const,
    },
  };
}

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

export async function listOwnedDocumentsForUser(
  userId: string,
  query?: string | null,
) {
  return prisma.document.findMany({
    where: {
      ownerId: userId,
      ...titleSearchFilter(query),
    },
    orderBy: { updatedAt: "desc" },
    select: ownedDocumentSelect,
  });
}

export async function getDashboardDocuments(
  userId: string,
  query?: string | null,
) {
  const [owned, shared] = await Promise.all([
    listOwnedDocumentsForUser(userId, query),
    prisma.document.findMany({
      where: {
        shares: { some: { userId } },
        NOT: { ownerId: userId },
        ...titleSearchFilter(query),
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
