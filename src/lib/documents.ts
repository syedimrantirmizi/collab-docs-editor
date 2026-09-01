import type { JSONContent } from "@tiptap/core";
import type { Prisma, ShareRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { canDelete, canRead, canShare, canWrite } from "@/lib/permissions";

export const EMPTY_DOCUMENT_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export async function getDocumentWithShares(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      shares: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getReadableDocument(id: string, userId: string) {
  const document = await getDocumentWithShares(id);

  if (!document || !canRead(userId, document)) {
    return null;
  }

  return document;
}

export async function getWritableDocument(id: string, userId: string) {
  const document = await getDocumentWithShares(id);

  if (!document || !canWrite(userId, document)) {
    return null;
  }

  return document;
}

export async function createDocumentForUser(
  userId: string,
  title = "Untitled document",
  content: JSONContent = EMPTY_DOCUMENT_CONTENT,
) {
  return prisma.document.create({
    data: {
      title,
      ownerId: userId,
      content: content as Prisma.InputJsonValue,
    },
  });
}

export async function deleteDocumentForUser(id: string, userId: string) {
  const document = await getDocumentWithShares(id);

  if (!document || !canDelete(userId, document)) {
    return null;
  }

  return prisma.document.delete({
    where: { id },
    select: { id: true },
  });
}

export type ShareDocumentResult =
  | {
      ok: true;
      share: Prisma.DocumentShareGetPayload<{
        include: {
          user: { select: { id: true; name: true; email: true } };
        };
      }>;
    }
  | { ok: false; code: "NOT_FOUND" | "USER_NOT_FOUND" | "CANNOT_SHARE_WITH_SELF" };

export async function shareDocumentWithUser(
  documentId: string,
  ownerId: string,
  email: string,
  role: ShareRole,
): Promise<ShareDocumentResult> {
  const document = await getDocumentWithShares(documentId);

  if (!document || !canShare(ownerId, document)) {
    return { ok: false, code: "NOT_FOUND" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return { ok: false, code: "USER_NOT_FOUND" };
  }

  if (user.id === ownerId) {
    return { ok: false, code: "CANNOT_SHARE_WITH_SELF" };
  }

  const share = await prisma.documentShare.upsert({
    where: {
      documentId_userId: {
        documentId,
        userId: user.id,
      },
    },
    update: { role },
    create: {
      documentId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return { ok: true, share };
}
