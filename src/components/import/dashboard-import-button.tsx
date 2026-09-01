"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import {
  ImportFileDialog,
  importNewDocument,
} from "@/components/import/import-file-dialog";
import { Button } from "@/components/ui/button";

export function DashboardImportButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="gap-2 bg-card"
        onClick={() => setOpen(true)}
      >
        <Upload className="size-4" />
        Import file
      </Button>

      <ImportFileDialog
        open={open}
        onOpenChange={setOpen}
        title="Import a new document"
        description="Upload a file to create a new document from its contents. The title will come from the file name."
        onImport={async (file) => {
          const document = await importNewDocument(file);
          toast.success("Document imported");
          router.push(`/doc/${document.id}`);
          router.refresh();
        }}
      />
    </>
  );
}
