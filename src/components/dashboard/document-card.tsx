import Link from "next/link";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type DocumentCardProps = {
  id: string;
  title: string;
  updatedAt: Date;
  badge: { label: string; className?: string };
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function DocumentCard({
  id,
  title,
  updatedAt,
  badge,
  subtitle,
  actions,
  className,
}: DocumentCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200",
        "hover:border-primary/25 hover:shadow-md",
        className,
      )}
    >
      <Link
        href={`/doc/${id}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open ${title}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <FileText className="size-5" />
        </div>
        <div className="relative z-10 flex items-center gap-1">
          {actions}
          <Badge
            variant="secondary"
            className={cn("shrink-0 font-normal", badge.className)}
          >
            {badge.label}
          </Badge>
        </div>
      </div>
      <div className="relative space-y-1">
        <h3 className="line-clamp-2 font-medium leading-snug tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(updatedAt)}
        </p>
      </div>
    </div>
  );
}
