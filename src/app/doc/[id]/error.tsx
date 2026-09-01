"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ErrorPageHeader } from "@/components/layout/error-page-header";
import { Button } from "@/components/ui/button";

type DocErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DocError({ error, reset }: DocErrorProps) {
  useEffect(() => {
    toast.error("Could not load document", {
      description: "The document may have been deleted or you may not have access.",
    });
  }, [error]);

  return (
    <div className="min-h-svh bg-background">
      <ErrorPageHeader />
      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">Document unavailable</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t open this document. Check your connection or return to
          the dashboard.
        </p>
        <div className="flex gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Back to documents
          </Button>
        </div>
      </main>
    </div>
  );
}
