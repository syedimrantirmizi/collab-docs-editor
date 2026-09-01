import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { JSONContent } from "@tiptap/core";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getWritableDocument } from "@/lib/documents";
import { ImportError } from "@/lib/import/errors";
import { mergeTipTapContent } from "@/lib/import/merge-content";
import { parseImportFile } from "@/lib/import/parse-file";
import { importModeSchema } from "@/lib/validators";

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
  const document = await getWritableDocument(id, session.user.id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose a file to import", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const modeResult = importModeSchema.safeParse(formData.get("mode") ?? "replace");

  if (!modeResult.success) {
    return NextResponse.json(
      { error: "Invalid import mode", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const imported = await parseImportFile(buffer, file.name);
    const merged = mergeTipTapContent(
      document.content as JSONContent,
      imported,
      modeResult.data,
    );

    const updated = await prisma.document.update({
      where: { id },
      data: {
        content: merged as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ImportError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 },
      );
    }

    console.error("Document import failed:", error);

    return NextResponse.json(
      { error: "Could not import file", code: "IMPORT_FAILED" },
      { status: 500 },
    );
  }
}
