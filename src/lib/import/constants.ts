export const IMPORT_ACCEPT =
  ".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const IMPORT_FORMATS_LABEL = ".txt, .md, .docx";

export const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const SUPPORTED_IMPORT_EXTENSIONS = [".txt", ".md", ".docx"] as const;

export type SupportedImportExtension =
  (typeof SUPPORTED_IMPORT_EXTENSIONS)[number];
