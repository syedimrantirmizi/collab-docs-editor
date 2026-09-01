"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authenticate } from "@/lib/actions/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/60 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in with your demo account to open your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-1">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alice@ajaia.test"
                  autoComplete="email"
                  className="h-10 bg-background"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="h-10 bg-background"
                  required
                />
              </Field>
              {errorMessage ? (
                <p
                  className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}
              <Field className="pt-2">
                <Button
                  type="submit"
                  className="h-10 w-full shadow-sm"
                  disabled={isPending}
                >
                  {isPending ? "Signing in…" : "Continue to workspace"}
                </Button>
                <FieldDescription className="rounded-lg bg-muted/50 px-3 py-2 text-center text-xs">
                  Demo accounts use password{" "}
                  <span className="font-medium text-foreground">password123</span>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
