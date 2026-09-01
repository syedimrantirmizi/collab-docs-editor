import type { JSONContent } from "@tiptap/core";

function paragraphFromText(text: string): JSONContent {
  const lines = text.split("\n");

  if (lines.length === 1) {
    return {
      type: "paragraph",
      content: text.length > 0 ? [{ type: "text", text }] : [],
    };
  }

  const content: JSONContent[] = [];

  lines.forEach((line, index) => {
    if (line.length > 0) {
      content.push({ type: "text", text: line });
    }

    if (index < lines.length - 1) {
      content.push({ type: "hardBreak" });
    }
  });

  return {
    type: "paragraph",
    content: content.length > 0 ? content : [],
  };
}

export function textToTipTap(text: string): JSONContent {
  const normalized = text.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
  }

  const blocks = normalized.split(/\n{2,}/);

  return {
    type: "doc",
    content: blocks.map((block) => paragraphFromText(block.trim())),
  };
}
