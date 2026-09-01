import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { shareDocumentWithUser } from "@/lib/documents";
import { shareDocumentSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const parsed = shareDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        code: "BAD_REQUEST",
      },
      { status: 400 },
    );
  }

  const result = await shareDocumentWithUser(
    id,
    session.user.id,
    parsed.data.email,
    parsed.data.role,
  );

  if (!result.ok) {
    if (result.code === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Document not found", code: result.code },
        { status: 404 },
      );
    }

    if (result.code === "USER_NOT_FOUND") {
      return NextResponse.json(
        {
          error:
            "No user found with that email. They need an Ajaia Docs account first.",
          code: result.code,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "You cannot share a document with yourself.",
        code: result.code,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ share: result.share });
}
