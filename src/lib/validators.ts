import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const importModeSchema = z.enum(["replace", "append"]);

export const shareDocumentSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["VIEWER", "EDITOR"]),
});

export type ImportMode = z.infer<typeof importModeSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
