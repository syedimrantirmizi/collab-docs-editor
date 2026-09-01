"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteDocumentDialog } from "@/components/dashboard/delete-document-dialog";
import { DocumentCard } from "@/components/dashboard/document-card";
import { Button } from "@/components/ui/button";

type OwnedDocumentCardProps = {
  id: string;
  title: string;
  updatedAt: Date;
  ownerName: string;
};

export function OwnedDocumentCard({
  id,
  title,
  updatedAt,
  ownerName,
}: OwnedDocumentCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Document deleted");
      setDeleteOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not delete document", {
        description: "Please try again in a moment.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <DocumentCard
        id={id}
        title={title}
        updatedAt={updatedAt}
        subtitle={`Owned by ${ownerName}`}
        badge={{
          label: "Owned",
          className: "bg-sky-100 text-sky-800 hover:bg-sky-100",
        }}
        actions={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="relative z-10 size-8 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Delete ${title}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />

      <DeleteDocumentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={title}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
