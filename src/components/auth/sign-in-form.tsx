"use client";

import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Link from "next/link";
import { PasswordInput } from "./password-input";
import { OAuthButtons } from "./oauth-button";
import { AuthCard } from "./auth-card";
import { Controller, useForm } from "react-hook-form";
import { LoginInput, loginSchema } from "@/types/forms/auth-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSubmitButton } from "./auth-submit-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/errors/auth-errors";
import { TextField } from "../forms/text-fields";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(getAuthErrorMessage(error.code, error.message));
      return;
    }

    toast.success("Bentornato");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Sign In" description="Entra nel tuo account">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TextField
              control={form.control}
              name="email"
              autoComplete="email"
              type="email"
              placeholder="jhondoe@mail.com"
              label="Email"
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <PasswordInput {...field} autoComplete="current-password" />

                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            <Field className="mt-8">
              <AuthSubmitButton
                label="Sign in"
                loadingLabel="loggando..."
                loading={form.formState.isSubmitting}
              />
            </Field>
            <FieldSeparator>Or continue with</FieldSeparator>
            <Field>
              <OAuthButtons />
              <FieldDescription className="text-center">
                Non hai un account <Link href="/auth/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  );
}
