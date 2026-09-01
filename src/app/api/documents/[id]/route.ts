import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  deleteDocumentForUser,
  getReadableDocument,
  getWritableDocument,
} from "@/lib/documents";
import { snapshotDocumentBeforeUpdate } from "@/lib/revisions";
import { updateDocumentSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const document = await getReadableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json(document);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const document = await getWritableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const parsed = updateDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  if (!parsed.data.title && !parsed.data.content) {
    return NextResponse.json(
      { error: "Nothing to update", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  await snapshotDocumentBeforeUpdate(
    document,
    session.user.id,
    parsed.data.title,
    parsed.data.content as Prisma.InputJsonValue | undefined,
  );

  const updated = await prisma.document.update({
    where: { id },
    data: {
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
      ...(parsed.data.content
        ? { content: parsed.data.content as Prisma.InputJsonValue }
        : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const deleted = await deleteDocumentForUser(id, session.user.id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: deleted.id });
}
