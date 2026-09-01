import Link from "next/link";
import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { getInitials } from "@/lib/format";

export async function AppHeader() {
  const session = await auth();
  const displayName = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
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
        {session?.user ? (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left leading-tight">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}
