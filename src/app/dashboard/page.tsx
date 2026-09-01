import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FilePlus, Share2 } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DocumentCard } from "@/components/dashboard/document-card";
import { OwnedDocumentCard } from "@/components/dashboard/owned-document-card";
import { DocumentsEmpty } from "@/components/dashboard/documents-empty";
import { DashboardImportButton } from "@/components/import/dashboard-import-button";
import { createDocumentAction } from "@/lib/actions/documents";
import { getDashboardDocuments } from "@/lib/queries/documents";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { owned, shared } = await getDashboardDocuments(session.user.id);

  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-background to-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Your documents
            </h1>
            <p className="text-base text-muted-foreground">
              Draft, import, and share rich-text documents with your team — all
              in one calm workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <form action={createDocumentAction}>
              <Button type="submit" className="gap-2 shadow-sm">
                <FilePlus className="size-4" />
                New document
              </Button>
            </form>
            <DashboardImportButton />
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
            {owned.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {owned.map((doc) => (
                  <OwnedDocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    updatedAt={doc.updatedAt}
                    ownerName={doc.owner.name ?? session.user.name ?? "You"}
                  />
                ))}
              </div>
            ) : (
              <DocumentsEmpty
                icon={FilePlus}
                title="Start your first document"
                description="Create a blank doc or import a .txt, .md, or .docx file to begin writing with your team."
                actionLabel="New document"
              />
            )}
          </DashboardSection>

          <DashboardSection
            title="Shared with me"
            badge={{
              label: "Shared",
              className: "bg-violet-100 text-violet-800 hover:bg-violet-100",
            }}
          >
            {shared.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shared.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    updatedAt={doc.updatedAt}
                    subtitle={`Shared by ${doc.owner.name} · ${doc.shares[0]?.role === "VIEWER" ? "Viewer" : "Editor"}`}
                    badge={{
                      label: "Shared",
                      className: "bg-violet-100 text-violet-800 hover:bg-violet-100",
                    }}
                  />
                ))}
              </div>
            ) : (
              <DocumentsEmpty
                icon={Share2}
                title="No shared documents yet"
                description="When a teammate shares a document with you, it will show up here ready to open and collaborate."
              />
            )}
          </DashboardSection>
        </div>
      </main>
    </div>
  );
}
