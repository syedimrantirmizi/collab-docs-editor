"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime, getInitials } from "@/lib/format";

type CommentEntry = {
  id: string;
  body: string;
  excerpt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type CommentsPanelProps = {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
  currentUserId: string;
  documentOwnerId: string;
};

export function CommentsPanel({
  documentId,
  open,
  onOpenChange,
  editor,
  currentUserId,
  documentOwnerId,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selection = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " ",
    );
    setExcerpt(selection?.trim() ? selection.trim() : null);

    async function loadComments() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/documents/${documentId}/comments`);

        if (!response.ok) {
          throw new Error("Could not load comments.");
        }

        const data = (await response.json()) as { comments: CommentEntry[] };
        setComments(data.comments);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load comments.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadComments();
  }, [open, documentId, editor]);

  async function handleSubmit() {
    const trimmed = body.trim();

    if (!trimmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/documents/${documentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          excerpt: excerpt ?? undefined,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        comment?: CommentEntry;
      };

      if (!response.ok || !data.comment) {
        throw new Error(data.error ?? "Could not add comment.");
      }

      setComments((current) => [...current, data.comment!]);
      setBody("");
      setExcerpt(null);
      toast.success("Comment added");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const response = await fetch(
        `/api/documents/${documentId}/comments/${commentId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Could not delete comment.");
      }

      setComments((current) => current.filter((entry) => entry.id !== commentId));
      toast.success("Comment removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete comment.",
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            Comments
          </SheetTitle>
          <SheetDescription>
            Discuss this document with collaborators. Select text before opening
            to attach a quote.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1 px-6 py-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading comments…</p>
          ) : comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment) => {
                const canDelete =
                  comment.user.id === currentUserId ||
                  documentOwnerId === currentUserId;

                return (
                  <li
                    key={comment.id}
                    className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {getInitials(comment.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">
                              {comment.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(new Date(comment.createdAt))}
                            </p>
                          </div>
                          {canDelete ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete comment"
                              onClick={() => void handleDelete(comment.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                        {comment.excerpt ? (
                          <p className="mt-2 rounded-md border-l-2 border-primary/40 bg-muted/30 px-3 py-2 text-xs text-muted-foreground italic">
                            “{comment.excerpt}”
                          </p>
                        ) : null}
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the conversation below.
            </p>
          )}
        </ScrollArea>

        <div className="border-t border-border/60 bg-muted/20 p-6">
          {excerpt ? (
            <p className="mb-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              Quoting: “{excerpt}”
            </p>
          ) : null}
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write a comment…"
            rows={3}
            className="bg-card"
          />
          <Button
            type="button"
            className="mt-3 w-full"
            disabled={isSubmitting || !body.trim()}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? "Posting…" : "Post comment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
