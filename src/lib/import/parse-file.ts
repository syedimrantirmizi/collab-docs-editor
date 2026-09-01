import type { JSONContent } from "@tiptap/core";
import { generateJSON } from "@tiptap/html";
import mammoth from "mammoth";
import { marked } from "marked";
import { getContentExtensions } from "@/lib/editor-extensions";
import {
  MAX_IMPORT_FILE_SIZE_BYTES,
  SUPPORTED_IMPORT_EXTENSIONS,
  type SupportedImportExtension,
} from "@/lib/import/constants";
import { ImportError } from "@/lib/import/errors";
import { textToTipTap } from "@/lib/import/text-to-tiptap";

function getExtension(filename: string): SupportedImportExtension | null {
  const lower = filename.toLowerCase();

  for (const extension of SUPPORTED_IMPORT_EXTENSIONS) {
    if (lower.endsWith(extension)) {
      return extension;
    }
  }

  return null;
}

function validateImportFile(buffer: Buffer, filename: string) {
  if (!filename.trim()) {
    throw new ImportError("A file name is required.", "BAD_REQUEST");
  }

  if (buffer.byteLength === 0) {
    throw new ImportError("The selected file is empty.", "EMPTY_FILE");
  }

  if (buffer.byteLength > MAX_IMPORT_FILE_SIZE_BYTES) {
    throw new ImportError(
      "File is too large. Maximum size is 5 MB.",
      "FILE_TOO_LARGE",
    );
  }

  if (!getExtension(filename)) {
    throw new ImportError(
      "Unsupported file type. Use .txt, .md, or .docx.",
      "UNSUPPORTED_TYPE",
    );
  }
}

function htmlToTipTap(html: string): JSONContent {
  const trimmed = html.trim();

  if (!trimmed) {
    return textToTipTap("");
  }

  return generateJSON(trimmed, getContentExtensions());
}

export async function parseImportFile(
  buffer: Buffer,
  filename: string,
): Promise<JSONContent> {
  validateImportFile(buffer, filename);

  const extension = getExtension(filename);

  switch (extension) {
    case ".txt":
      return textToTipTap(buffer.toString("utf-8"));
    case ".md": {
      const html = await marked.parse(buffer.toString("utf-8"));
      return htmlToTipTap(typeof html === "string" ? html : "");
    }
    case ".docx": {
      const { value: html } = await mammoth.convertToHtml({ buffer });
      return htmlToTipTap(html);
    }
    default:
      throw new ImportError(
        "Unsupported file type. Use .txt, .md, or .docx.",
        "UNSUPPORTED_TYPE",
      );
  }
}
