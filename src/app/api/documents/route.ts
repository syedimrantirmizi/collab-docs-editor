import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createDocumentForUser } from "@/lib/documents";
import { getDashboardDocuments } from "@/lib/queries/documents";
import { createDocumentSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { owned, shared } = await getDashboardDocuments(session.user.id);

  return NextResponse.json({ owned, shared });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  let body: unknown = {};

  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const parsed = createDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const document = await createDocumentForUser(
    session.user.id,
    parsed.data.title ?? "Untitled document",
  );

  return NextResponse.json(document, { status: 201 });
}
