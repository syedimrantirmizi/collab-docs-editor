"use client";

import Link from "next/link";

export function ErrorPageHeader() {
  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            A
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Ajaia Docs
          </span>
        </Link>
      </div>
    </header>
  );
}
