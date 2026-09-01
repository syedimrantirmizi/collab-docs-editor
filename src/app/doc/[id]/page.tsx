import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { ShareRole } from "@prisma/client";
import { AppHeader } from "@/components/layout/app-header";
import { DocumentEditor } from "@/components/editor/document-editor";
import type { JSONContent } from "@tiptap/core";
import { getReadableDocument } from "@/lib/documents";
import { canShare, canWrite } from "@/lib/permissions";

type DocPageProps = {
  params: Promise<{ id: string }>;
};

function getAccessLabel(
  userId: string,
  document: NonNullable<Awaited<ReturnType<typeof getReadableDocument>>>,
): "Owner" | "Editor" | "Viewer" | undefined {
  if (document.ownerId === userId) {
    return "Owner";
  }

  const share = document.shares.find((entry) => entry.userId === userId);

  if (!share) {
    return undefined;
  }

  return share.role === ShareRole.VIEWER ? "Viewer" : "Editor";
}

export default async function DocPage({ params }: DocPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const document = await getReadableDocument(id, session.user.id);

  if (!document) {
    notFound();
  }

  const accessLabel = getAccessLabel(session.user.id, document);

  return (
    <>
      <AppHeader />
      <DocumentEditor
        documentId={document.id}
        initialTitle={document.title}
        initialContent={document.content as JSONContent}
        canWrite={canWrite(session.user.id, document)}
        canShare={canShare(session.user.id, document)}
        accessLabel={accessLabel}
      />
    </>
  );
}
