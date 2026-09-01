"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IMPORT_ACCEPT,
  IMPORT_FORMATS_LABEL,
} from "@/lib/import/constants";
import type { ImportMode } from "@/lib/validators";
import { cn } from "@/lib/utils";

type ImportFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File, mode: ImportMode) => Promise<void>;
  showMode?: boolean;
  title?: string;
  description?: string;
};

export function ImportFileDialog({
  open,
  onOpenChange,
  onImport,
  showMode = false,
  title = "Import file",
  description = "Upload a text, markdown, or Word document to bring content into Ajaia Docs.",
}: ImportFileDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ImportMode>("replace");
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  function resetState() {
    setSelectedFile(null);
    setMode("replace");
    setError(null);
    setIsImporting(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetState();
    }

    onOpenChange(nextOpen);
  }

  async function handleImport() {
    if (!selectedFile) {
      setError("Choose a file to import.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      await onImport(selectedFile, mode);
      handleOpenChange(false);
    } catch (importError) {
      const message =
        importError instanceof Error
          ? importError.message
          : "Could not import file.";
      setError(message);
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-file-input">File</Label>
            <input
              ref={inputRef}
              id="import-file-input"
              type="file"
              accept={IMPORT_ACCEPT}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-card file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/50"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
                setError(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: {IMPORT_FORMATS_LABEL}. Max size 5 MB.
            </p>
          </div>

          {showMode ? (
            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <Label>Import mode</Label>
              <RadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as ImportMode)}
                className="gap-3"
              >
                <label
                  htmlFor="import-mode-replace"
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 transition-colors",
                    mode === "replace" && "border-primary/20 bg-primary/5",
                  )}
                >
                  <RadioGroupItem value="replace" id="import-mode-replace" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Replace content</p>
                    <p className="text-xs text-muted-foreground">
                      Swap the current document body with the imported file.
                    </p>
                  </div>
                </label>
                <label
                  htmlFor="import-mode-append"
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 transition-colors",
                    mode === "append" && "border-primary/20 bg-primary/5",
                  )}
                >
                  <RadioGroupItem value="append" id="import-mode-append" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Append content</p>
                    <p className="text-xs text-muted-foreground">
                      Add the imported file after your existing content.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={() => void handleImport()}
            disabled={isImporting}
          >
            <Upload className="size-4" />
            {isImporting ? "Importing…" : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function readImportError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? "Could not import file.";
  } catch {
    return "Could not import file.";
  }
}

export async function importNewDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/documents/import", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readImportError(response));
  }

  return response.json() as Promise<{ id: string }>;
}

export async function importIntoDocument(
  documentId: string,
  file: File,
  mode: ImportMode,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);

  const response = await fetch(`/api/documents/${documentId}/import`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readImportError(response));
  }

  return response.json() as Promise<{ content: unknown }>;
}
