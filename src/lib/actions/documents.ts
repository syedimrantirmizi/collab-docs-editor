"use server";

import { auth } from "@/auth";
import { createDocumentForUser } from "@/lib/documents";
import { redirect } from "next/navigation";

export async function createDocumentAction() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const document = await createDocumentForUser(session.user.id);
  redirect(`/doc/${document.id}`);
}
