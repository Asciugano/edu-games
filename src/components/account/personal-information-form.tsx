"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/errors/auth-errors";

import {
  UpdateProfileInput,
  updateProfileSchema,
} from "@/types/forms/auth-form";

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AvatarUploadButton } from "./avatar-upload-button";
import { TextField } from "../forms/text-fields";
import { deleteOldAvatar } from "@/actions/avatar";

export function PersonalInformationForm() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      image: {
        key: "",
        url: "",
      },
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      name: user.name,
      email: user.email,
      image: {
        url: user.image ?? "",
        key: user.imageKey ?? "",
      },
    });
  }, [user, form]);

  async function onSubmit(data: UpdateProfileInput) {
    const oldImageKey = user?.imageKey;
    const { error } = await authClient.updateUser({
      name: data.name ?? user?.name,
      // email: data.email ?? user?.email,
      image: data.image.url ?? user?.image,
      imageKey: data.image.key ?? user?.imageKey,
    });

    if (error) {
      toast.error(getAuthErrorMessage(error.code, error.message));
      return;
    }

    if (oldImageKey) await deleteOldAvatar(oldImageKey);

    toast.success("Profile updated!");
  }

  if (!user) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField control={form.control} name="name" label="Nome" />

        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
        />
      </div>

      {/* Avatar field */}
      <Controller
        control={form.control}
        name="image"
        render={({ field }) => (
          <AvatarUploadButton
            value={field.value.url}
            onChange={field.onChange}
            name={form.watch("image.url")}
          />
        )}
      />

      <AuthSubmitButton
        label="Save changes"
        loadingLabel="Saving..."
        loading={form.formState.isSubmitting}
        disabled={!form.formState.isDirty}
      />
    </form>
  );
}
