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
import { AuthSubmitButton } from "./auth-submit-button";
import { Controller, useForm } from "react-hook-form";
import { RegisterInput, registerSchema } from "@/types/forms/auth-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/errors/auth-errors";
import { PasswordStrength } from "./password-strength";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../forms/text-fields";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  async function onSubmit(data: RegisterInput) {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(getAuthErrorMessage(error.code, error.message));
      return;
    }

    toast.success("Account creato");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthCard title="Sign up" description="crea il tuo account">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TextField
              control={form.control}
              name="name"
              placeholder="Jhon Doe"
              autoComplete="name"
              label="Nome"
            />

            <TextField
              control={form.control}
              name="email"
              type="email"
              autoComplete="email"
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
                  </div>
                  <PasswordInput {...field} autoComplete="new-password" />

                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </Field>
              )}
            />

            <PasswordStrength password={password} />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Conferma la Password</FieldLabel>

                  <PasswordInput {...field} autoComplete="new-password" />

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
                label="Sign up"
                loadingLabel="registrando..."
                loading={form.formState.isSubmitting}
              />
            </Field>
            <FieldSeparator>O continua con</FieldSeparator>
            <Field>
              <OAuthButtons />
              <FieldDescription className="text-center">
                Hai gia&apos; un account{" "}
                <Link href="/auth/sign-in">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthCard>
    </div>
  );
}
