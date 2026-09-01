export function titleFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension.replace(/[-_]+/g, " ").trim();

  return normalized.length > 0 ? normalized : "Imported document";
}
