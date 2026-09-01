"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LinkDialogProps = {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LinkDialog({ editor, open, onOpenChange }: LinkDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !editor) {
      return;
    }

    const href = editor.getAttributes("link").href as string | undefined;
    setUrl(href ?? "");
    setError(null);
  }, [open, editor]);

  function applyLink() {
    if (!editor) {
      return;
    }

    const trimmed = url.trim();

    if (trimmed !== "" && !/^https?:\/\/.+/i.test(trimmed)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }

    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    }

    onOpenChange(false);
  }

  function removeLink() {
    if (!editor) {
      return;
    }

    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert link</DialogTitle>
          <DialogDescription>
            Add a URL to the selected text. Leave empty and apply to remove an
            existing link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="editor-link-url">URL</Label>
          <Input
            id="editor-link-url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(null);
            }}
            placeholder="https://example.com"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
            }}
          />
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          {editor?.isActive("link") ? (
            <Button
              type="button"
              variant="outline"
              onClick={removeLink}
              className="mr-auto"
            >
              Remove link
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={applyLink}>
            Apply link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
