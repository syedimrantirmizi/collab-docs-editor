import type { JSONContent } from "@tiptap/core";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const MAX_REVISIONS_PER_DOCUMENT = 30;

export async function createDocumentRevision(
  documentId: string,
  createdById: string,
  title: string,
  content: Prisma.InputJsonValue,
) {
  const revision = await prisma.documentRevision.create({
    data: {
      documentId,
      createdById,
      title,
      content,
    },
  });

  const staleRevisions = await prisma.documentRevision.findMany({
    where: { documentId },
    orderBy: { createdAt: "desc" },
    skip: MAX_REVISIONS_PER_DOCUMENT,
    select: { id: true },
  });

  if (staleRevisions.length > 0) {
    await prisma.documentRevision.deleteMany({
      where: { id: { in: staleRevisions.map((entry) => entry.id) } },
    });
  }

  return revision;
}

export async function snapshotDocumentBeforeUpdate(
  document: {
    id: string;
    title: string;
    content: Prisma.JsonValue;
  },
  userId: string,
  nextTitle?: string,
  nextContent?: unknown,
) {
  const titleChanged =
    typeof nextTitle === "string" && nextTitle.trim() !== document.title;
  const contentChanged =
    nextContent !== undefined &&
    JSON.stringify(nextContent) !== JSON.stringify(document.content);

  if (!titleChanged && !contentChanged) {
    return;
  }

  await createDocumentRevision(
    document.id,
    userId,
    document.title,
    document.content as Prisma.InputJsonValue,
  );
}

export async function listDocumentRevisions(documentId: string) {
  return prisma.documentRevision.findMany({
    where: { documentId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getDocumentRevision(id: string, documentId: string) {
  return prisma.documentRevision.findFirst({
    where: { id, documentId },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
