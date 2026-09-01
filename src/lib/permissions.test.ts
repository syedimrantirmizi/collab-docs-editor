import { ShareRole } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  canDelete,
  canRead,
  canShare,
  canWrite,
} from "@/lib/permissions";

const ownerId = "owner-1";
const editorId = "editor-1";
const viewerId = "viewer-1";
const outsiderId = "outsider-1";

function makeDocument(overrides?: {
  ownerId?: string;
  shares?: Array<{ userId: string; role: ShareRole }>;
}) {
  return {
    id: "doc-1",
    title: "Test",
    content: {},
    ownerId: overrides?.ownerId ?? ownerId,
    createdAt: new Date(),
    updatedAt: new Date(),
    shares: (overrides?.shares ?? []).map((share, index) => ({
      id: `share-${index}`,
      documentId: "doc-1",
      userId: share.userId,
      role: share.role,
      createdAt: new Date(),
    })),
  };
}

describe("permissions", () => {
  const sharedDoc = makeDocument({
    shares: [
      { userId: editorId, role: ShareRole.EDITOR },
      { userId: viewerId, role: ShareRole.VIEWER },
    ],
  });

  it("allows owners full access", () => {
    expect(canRead(ownerId, sharedDoc)).toBe(true);
    expect(canWrite(ownerId, sharedDoc)).toBe(true);
    expect(canShare(ownerId, sharedDoc)).toBe(true);
    expect(canDelete(ownerId, sharedDoc)).toBe(true);
  });

  it("allows editors to read and write but not share or delete", () => {
    expect(canRead(editorId, sharedDoc)).toBe(true);
    expect(canWrite(editorId, sharedDoc)).toBe(true);
    expect(canShare(editorId, sharedDoc)).toBe(false);
    expect(canDelete(editorId, sharedDoc)).toBe(false);
  });

  it("allows viewers to read only", () => {
    expect(canRead(viewerId, sharedDoc)).toBe(true);
    expect(canWrite(viewerId, sharedDoc)).toBe(false);
    expect(canShare(viewerId, sharedDoc)).toBe(false);
    expect(canDelete(viewerId, sharedDoc)).toBe(false);
  });

  it("denies outsiders completely", () => {
    expect(canRead(outsiderId, sharedDoc)).toBe(false);
    expect(canWrite(outsiderId, sharedDoc)).toBe(false);
    expect(canShare(outsiderId, sharedDoc)).toBe(false);
    expect(canDelete(outsiderId, sharedDoc)).toBe(false);
  });

  it("treats unshared owned documents as owner-only", () => {
    const ownedDoc = makeDocument({ shares: [] });

    expect(canRead(ownerId, ownedDoc)).toBe(true);
    expect(canWrite(ownerId, ownedDoc)).toBe(true);
    expect(canRead(outsiderId, ownedDoc)).toBe(false);
    expect(canWrite(outsiderId, ownedDoc)).toBe(false);
  });
});
