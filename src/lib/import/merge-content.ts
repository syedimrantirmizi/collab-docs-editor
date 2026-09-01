import type { JSONContent } from "@tiptap/core";
import type { ImportMode } from "@/lib/validators";

export function mergeTipTapContent(
  existing: JSONContent,
  imported: JSONContent,
  mode: ImportMode,
): JSONContent {
  if (mode === "replace") {
    return imported;
  }

  const existingNodes = existing.content ?? [];
  const importedNodes = imported.content ?? [];

  if (importedNodes.length === 0) {
    return existing;
  }

  if (existingNodes.length === 0) {
    return imported;
  }

  return {
    type: "doc",
    content: [...existingNodes, ...importedNodes],
  };
}
