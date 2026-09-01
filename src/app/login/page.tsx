import { FileText, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r bg-[radial-gradient(circle_at_20%_20%,_oklch(0.95_0.04_180)_0%,_transparent_50%),radial-gradient(circle_at_80%_0%,_oklch(0.92_0.06_200)_0%,_transparent_40%)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-sm">
            A
          </span>
          <span className="text-xl font-semibold tracking-tight">Ajaia Docs</span>
        </div>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Built for focused team writing
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
            Documents your team can actually finish.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Create rich-text docs, import files, and share with the right people
            — without the weight of enterprise tooling.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Rich editing with headings, lists, and formatting
            </li>
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Import from .txt, .md, and .docx
            </li>
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Share with editor or viewer access
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Internal productivity tool for Ajaia teams
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            A
          </span>
          <span className="text-lg font-semibold">Ajaia Docs</span>
        </div>
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
