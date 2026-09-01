import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createDocumentAction } from "@/lib/actions/documents";

type DocumentsEmptyProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
};

export function DocumentsEmpty({
  icon: Icon,
  title,
  description,
  actionLabel,
}: DocumentsEmptyProps) {
  return (
    <Empty className="border border-dashed bg-muted/20 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle className="text-base font-semibold">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actionLabel ? (
        <EmptyContent>
          <form action={createDocumentAction}>
            <Button type="submit" className="gap-2">
              {actionLabel}
            </Button>
          </form>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
