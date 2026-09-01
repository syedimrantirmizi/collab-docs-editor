"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { ShareDialog } from "@/components/editor/share-dialog";
import {
  SaveIndicator,
  type SaveStatus,
} from "@/components/editor/save-indicator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ImportFileDialog,
  importIntoDocument,
} from "@/components/import/import-file-dialog";
import { getEditorExtensions } from "@/lib/editor-extensions";
import type { UpdateDocumentInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

type DocumentEditorProps = {
  documentId: string;
  initialTitle: string;
  initialContent: JSONContent;
  canWrite: boolean;
  canShare: boolean;
  accessLabel?: "Owner" | "Editor" | "Viewer";
};

async function patchDocument(documentId: string, data: UpdateDocumentInput) {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save document");
  }
}

export function DocumentEditor({
  documentId,
  initialTitle,
  initialContent,
  canWrite,
  canShare,
  accessLabel,
}: DocumentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [importOpen, setImportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContentRef = useRef<JSONContent>(initialContent);
  const latestTitleRef = useRef(initialTitle);

  const persist = useCallback(
    async (payload: UpdateDocumentInput) => {
      setSaveStatus("saving");

      try {
        await patchDocument(documentId, payload);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
        toast.error("Could not save changes", {
          description: "Check your connection and keep editing — we'll retry on your next change.",
        });
      }
    },
    [documentId],
  );

  const scheduleContentSave = useCallback(
    (content: JSONContent) => {
      latestContentRef.current = content;

      if (contentTimerRef.current) {
        clearTimeout(contentTimerRef.current);
      }

      contentTimerRef.current = setTimeout(() => {
        void persist({ content: latestContentRef.current });
      }, 1500);
    },
    [persist],
  );

  const scheduleTitleSave = useCallback(
    (nextTitle: string) => {
      latestTitleRef.current = nextTitle;

      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }

      titleTimerRef.current = setTimeout(() => {
        const trimmed = latestTitleRef.current.trim();
        if (!trimmed) {
          return;
        }
        void persist({ title: trimmed });
      }, 800);
    },
    [persist],
  );

  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: initialContent,
    editable: canWrite,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (!canWrite) {
        return;
      }
      scheduleContentSave(currentEditor.getJSON());
    },
  });

  useEffect(() => {
    return () => {
      if (contentTimerRef.current) {
        clearTimeout(contentTimerRef.current);
      }
      if (titleTimerRef.current) {
        clearTimeout(titleTimerRef.current);
      }
    };
  }, []);

  const handleImportedContent = useCallback(
    (content: JSONContent) => {
      editor?.commands.setContent(content);
      latestContentRef.current = content;
      void persist({ content });
      toast.success("Import complete");
    },
    [editor, persist],
  );

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-background to-background pb-16">
      <div className="sticky top-14 z-40 border-b border-border/60 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Back to documents"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <Input
              value={title}
              onChange={(event) => {
                const nextTitle = event.target.value;
                setTitle(nextTitle);
                if (canWrite) {
                  scheduleTitleSave(nextTitle);
                }
              }}
              readOnly={!canWrite}
              className="h-10 min-w-0 flex-1 border-none bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0"
              aria-label="Document title"
            />
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <SaveIndicator status={saveStatus} />
              {accessLabel && accessLabel !== "Owner" ? (
                <Badge
                  variant="secondary"
                  className={
                    accessLabel === "Viewer"
                      ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
                      : "bg-violet-100 text-violet-800 hover:bg-violet-100"
                  }
                >
                  {accessLabel}
                </Badge>
              ) : null}
              {canShare ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 className="size-4" />
                  Share
                </Button>
              ) : null}
            </div>
          </div>
          <EditorToolbar
            editor={editor}
            disabled={!canWrite}
            onImport={canWrite ? () => setImportOpen(true) : undefined}
          />
        </div>
      </div>

      {canShare ? (
        <ShareDialog
          documentId={documentId}
          open={shareOpen}
          onOpenChange={setShareOpen}
        />
      ) : null}

      {canWrite ? (
        <ImportFileDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          showMode
          title="Import into document"
          description="Bring content from a file into this document. Choose whether to replace everything or append to the end."
          onImport={async (file, mode) => {
            const updated = await importIntoDocument(documentId, file, mode);
            handleImportedContent(updated.content as JSONContent);
          }}
        />
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div
          className={cn(
            "app-surface mx-auto max-w-3xl overflow-hidden",
            !canWrite && "opacity-95",
          )}
        >
          {!canWrite ? (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              View only — you can read this document but not edit it.
            </div>
          ) : null}
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
}
