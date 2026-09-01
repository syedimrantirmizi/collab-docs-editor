"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ErrorPageHeader } from "@/components/layout/error-page-header";
import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    toast.error("Could not load your documents", {
      description: "Refresh the page or try again shortly.",
    });
  }, [error]);

  return (
    <div className="min-h-svh bg-background">
      <ErrorPageHeader />
      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your dashboard. Your documents are still safe —
          please try again.
        </p>
        <div className="flex gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Reload dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
