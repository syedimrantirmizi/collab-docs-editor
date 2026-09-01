"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type DashboardSearchProps = {
  initialQuery?: string;
};

export function DashboardSearch({ initialQuery = "" }: DashboardSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = query.trim();
      const currentParams = new URLSearchParams(window.location.search);
      const currentQuery = currentParams.get("q") ?? "";

      if (trimmed === currentQuery) {
        return;
      }

      const params = new URLSearchParams();

      if (trimmed) {
        params.set("q", trimmed);
      }

      const next = params.toString();
      router.replace(next ? `/dashboard?${next}` : "/dashboard");
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search documents by title…"
        className="h-10 bg-card pl-9"
        aria-label="Search documents"
      />
    </div>
  );
}
