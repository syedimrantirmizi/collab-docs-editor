import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getReadableDocument } from "@/lib/documents";
import { listDocumentRevisions } from "@/lib/revisions";

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

  const revisions = await listDocumentRevisions(id);

  return NextResponse.json({ revisions });
}
