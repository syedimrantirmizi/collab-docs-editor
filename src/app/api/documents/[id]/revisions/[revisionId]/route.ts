import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  getReadableDocument,
  getWritableDocument,
} from "@/lib/documents";
import {
  createDocumentRevision,
  getDocumentRevision,
} from "@/lib/revisions";

type RouteContext = {
  params: Promise<{ id: string; revisionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id, revisionId } = await context.params;
  const document = await getReadableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const revision = await getDocumentRevision(revisionId, id);

  if (!revision) {
    return NextResponse.json(
      { error: "Revision not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({ revision });
}

export async function POST(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id, revisionId } = await context.params;
  const document = await getWritableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const revision = await getDocumentRevision(revisionId, id);

  if (!revision) {
    return NextResponse.json(
      { error: "Revision not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  await createDocumentRevision(
    document.id,
    session.user.id,
    document.title,
    document.content as Prisma.InputJsonValue,
  );

  const updated = await prisma.document.update({
    where: { id },
    data: {
      title: revision.title,
      content: revision.content as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({ document: updated, revision });
}
