"use client";

import { useEffect, useState } from "react";
import { Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { ShareDocumentInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

type ShareEntry = {
  id: string;
  role: "VIEWER" | "EDITOR";
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type ShareDialogProps = {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShareDialog({
  documentId,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ShareDocumentInput["role"]>("EDITOR");
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setEmail("");
    setRole("EDITOR");
    setError(null);

    async function loadShares() {
      setIsLoadingShares(true);

      try {
        const response = await fetch(`/api/documents/${documentId}`);

        if (!response.ok) {
          throw new Error("Could not load collaborators.");
        }

        const data = (await response.json()) as { shares?: ShareEntry[] };
        setShares(data.shares ?? []);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load collaborators.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoadingShares(false);
      }
    }

    void loadShares();
  }, [open, documentId]);

  async function handleShare() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter a teammate's email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, role }),
      });

      const data = (await response.json()) as {
        error?: string;
        share?: ShareEntry;
      };

      if (!response.ok || !data.share) {
        throw new Error(data.error ?? "Could not share document.");
      }

      setShares((current) => {
        const withoutExisting = current.filter(
          (entry) => entry.user.id !== data.share!.user.id,
        );
        return [...withoutExisting, data.share!];
      });

      setEmail("");
      toast.success(`Shared with ${data.share.user.name}`);
    } catch (shareError) {
      const message =
        shareError instanceof Error
          ? shareError.message
          : "Could not share document.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Invite teammates by email. Editors can change content; viewers can
            only read.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-email">Email address</Label>
            <Input
              id="share-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(null);
              }}
              placeholder="bob@ajaia.test"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleShare();
                }
              }}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
            <Label>Access level</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) =>
                setRole(value as ShareDocumentInput["role"])
              }
              className="gap-3"
            >
              <label
                htmlFor="share-role-editor"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 transition-colors",
                  role === "EDITOR" && "border-primary/20 bg-primary/5",
                )}
              >
                <RadioGroupItem value="EDITOR" id="share-role-editor" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Editor</p>
                  <p className="text-xs text-muted-foreground">
                    Can read, edit, and save changes.
                  </p>
                </div>
              </label>
              <label
                htmlFor="share-role-viewer"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 transition-colors",
                  role === "VIEWER" && "border-primary/20 bg-primary/5",
                )}
              >
                <RadioGroupItem value="VIEWER" id="share-role-viewer" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Viewer</p>
                  <p className="text-xs text-muted-foreground">
                    Can open and read, but not edit.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">People with access</p>
            </div>

            {isLoadingShares ? (
              <p className="text-sm text-muted-foreground">Loading access…</p>
            ) : shares.length > 0 ? (
              <ul className="space-y-2">
                {shares.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {entry.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {entry.user.email}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 font-normal",
                        entry.role === "EDITOR"
                          ? "bg-violet-100 text-violet-800 hover:bg-violet-100"
                          : "bg-amber-100 text-amber-900 hover:bg-amber-100",
                      )}
                    >
                      {entry.role === "EDITOR" ? "Editor" : "Viewer"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only you have access right now.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Done
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={() => void handleShare()}
            disabled={isSubmitting}
          >
            <Share2 className="size-4" />
            {isSubmitting ? "Sharing…" : "Share access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
