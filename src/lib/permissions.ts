import { ShareRole } from "@prisma/client";
import type { Document, DocumentShare } from "@prisma/client";

type DocumentWithShares = Document & {
  shares: DocumentShare[];
};

export function canRead(userId: string, document: DocumentWithShares): boolean {
  if (document.ownerId === userId) {
    return true;
  }

  return document.shares.some((share) => share.userId === userId);
}

export function canWrite(userId: string, document: DocumentWithShares): boolean {
  if (document.ownerId === userId) {
    return true;
  }

  return document.shares.some(
    (share) => share.userId === userId && share.role === ShareRole.EDITOR,
  );
}

export function canShare(userId: string, document: DocumentWithShares): boolean {
  return document.ownerId === userId;
}

export function canDelete(userId: string, document: DocumentWithShares): boolean {
  return document.ownerId === userId;
}
