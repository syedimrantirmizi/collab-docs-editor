import { AppHeader } from "@/components/layout/app-header";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { Skeleton } from "@/components/ui/skeleton";

function DocumentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-background to-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>

        <div className="mt-12 space-y-12">
          <DashboardSection
            title="My documents"
            badge={{
              label: "Owned",
              className: "bg-sky-100 text-sky-800 hover:bg-sky-100",
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <DocumentCardSkeleton key={index} />
              ))}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Shared with me"
            badge={{
              label: "Shared",
              className: "bg-violet-100 text-violet-800 hover:bg-violet-100",
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <DocumentCardSkeleton key={index} />
              ))}
            </div>
          </DashboardSection>
        </div>
      </main>
    </div>
  );
}
