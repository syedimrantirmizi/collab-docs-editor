import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getReadableDocument } from "@/lib/documents";

type RouteContext = {
  params: Promise<{ id: string; commentId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id, commentId } = await context.params;
  const document = await getReadableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const comment = await prisma.documentComment.findFirst({
    where: { id: commentId, documentId: id },
  });

  if (!comment) {
    return NextResponse.json(
      { error: "Comment not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const canDelete =
    comment.userId === session.user.id || document.ownerId === session.user.id;

  if (!canDelete) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  await prisma.documentComment.delete({ where: { id: commentId } });

  return NextResponse.json({ id: commentId });
}
