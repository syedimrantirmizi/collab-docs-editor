"use client";

import { useEffect, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatRelativeTime } from "@/lib/format";
import { extractPlainTextFromTipTap } from "@/lib/tiptap-text";

type RevisionSummary = {
  id: string;
  title: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
};

type RevisionDetail = RevisionSummary & {
  content: JSONContent;
};

type VersionHistoryPanelProps = {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canWrite: boolean;
  onRestore: (document: { title: string; content: JSONContent }) => void;
};

export function VersionHistoryPanel({
  documentId,
  open,
  onOpenChange,
  canWrite,
  onRestore,
}: VersionHistoryPanelProps) {
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<RevisionDetail | null>(
    null,
  );
  const [restoreTarget, setRestoreTarget] = useState<RevisionSummary | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadRevisions() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/documents/${documentId}/revisions`);

        if (!response.ok) {
          throw new Error("Could not load version history.");
        }

        const data = (await response.json()) as {
          revisions: RevisionSummary[];
        };
        setRevisions(data.revisions);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load version history.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadRevisions();
  }, [open, documentId]);

  async function loadRevisionDetail(revisionId: string) {
    try {
      const response = await fetch(
        `/api/documents/${documentId}/revisions/${revisionId}`,
      );

      if (!response.ok) {
        throw new Error("Could not load this version.");
      }

      const data = (await response.json()) as { revision: RevisionDetail };
      setSelectedRevision(data.revision);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load this version.",
      );
    }
  }

  async function handleRestore() {
    if (!restoreTarget) {
      return;
    }

    setIsRestoring(true);

    try {
      const response = await fetch(
        `/api/documents/${documentId}/revisions/${restoreTarget.id}`,
        { method: "POST" },
      );

      const data = (await response.json()) as {
        error?: string;
        document?: { title: string; content: JSONContent };
      };

      if (!response.ok || !data.document) {
        throw new Error(data.error ?? "Could not restore version.");
      }

      onRestore({
        title: data.document.title,
        content: data.document.content,
      });
      setRestoreTarget(null);
      onOpenChange(false);
      toast.success("Version restored");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not restore version.",
      );
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
            <SheetTitle className="flex items-center gap-2">
              <History className="size-4 text-primary" />
              Version history
            </SheetTitle>
            <SheetDescription>
              Snapshots are saved automatically before each edit. Restore a
              previous version when you need to undo bigger changes.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1 px-6 py-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading versions…</p>
            ) : revisions.length > 0 ? (
              <ul className="space-y-3">
                {revisions.map((revision, index) => (
                  <li
                    key={revision.id}
                    className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {revision.title}
                          </p>
                          {index === 0 ? (
                            <Badge variant="secondary" className="font-normal">
                              Latest snapshot
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {revision.createdBy.name} ·{" "}
                          {formatRelativeTime(new Date(revision.createdAt))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void loadRevisionDetail(revision.id)}
                      >
                        Preview
                      </Button>
                      {canWrite ? (
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setRestoreTarget(revision)}
                        >
                          <RotateCcw className="size-3.5" />
                          Restore
                        </Button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No saved versions yet. Edits will create snapshots automatically.
              </p>
            )}
          </ScrollArea>

          {selectedRevision ? (
            <div className="border-t border-border/60 bg-muted/20 p-6">
              <p className="text-sm font-medium">{selectedRevision.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Preview from{" "}
                {formatRelativeTime(new Date(selectedRevision.createdAt))}
              </p>
              <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-muted-foreground">
                {extractPlainTextFromTipTap(selectedRevision.content) ||
                  "Empty document"}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setSelectedRevision(null)}
              >
                Close preview
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setRestoreTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              The current document will be replaced with “
              {restoreTarget?.title}”. A snapshot of today&apos;s content is
              saved before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRestoring}
              onClick={(event) => {
                event.preventDefault();
                void handleRestore();
              }}
            >
              {isRestoring ? "Restoring…" : "Restore version"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
