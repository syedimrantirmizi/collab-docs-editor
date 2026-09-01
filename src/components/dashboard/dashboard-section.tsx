import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title: string;
  badge: { label: string; className?: string };
  children: ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  badge,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2.5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <Badge
          variant="secondary"
          className={cn("font-normal", badge.className)}
        >
          {badge.label}
        </Badge>
      </div>
      {children}
    </section>
  );
}
