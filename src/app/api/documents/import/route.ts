import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createDocumentForUser } from "@/lib/documents";
import { ImportError } from "@/lib/import/errors";
import { parseImportFile } from "@/lib/import/parse-file";
import { titleFromFilename } from "@/lib/import/title-from-filename";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
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

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = await parseImportFile(buffer, file.name);
    const title = titleFromFilename(file.name);
    const document = await createDocumentForUser(
      session.user.id,
      title,
      content,
    );

    return NextResponse.json(document, { status: 201 });
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
