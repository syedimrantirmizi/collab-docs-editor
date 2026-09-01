type TipTapNode = {
  type?: string;
  text?: string;
  content?: TipTapNode[];
};

export function extractPlainTextFromTipTap(content: unknown, maxLength = 280): string {
  if (!content || typeof content !== "object") {
    return "";
  }

  const parts: string[] = [];

  function walk(node: TipTapNode) {
    if (node.text) {
      parts.push(node.text);
    }

    if (node.content) {
      node.content.forEach(walk);
    }
  }

  walk(content as TipTapNode);

  const text = parts.join(" ").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
}
