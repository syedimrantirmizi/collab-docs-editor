import { cn } from "@/lib/utils";

export type SaveStatus = "saved" | "saving" | "error" | "idle";

type SaveIndicatorProps = {
  status: SaveStatus;
  className?: string;
};

const labels: Record<SaveStatus, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn’t save",
};

export function SaveIndicator({ status, className }: SaveIndicatorProps) {
  if (status === "idle") {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium",
        status === "saved" && "text-emerald-600",
        status === "saving" && "text-amber-600",
        status === "error" && "text-destructive",
        className,
      )}
      role="status"
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "saved" && "bg-emerald-500",
          status === "saving" && "animate-pulse bg-amber-500",
          status === "error" && "bg-destructive",
        )}
      />
      {labels[status]}
    </span>
  );
}
