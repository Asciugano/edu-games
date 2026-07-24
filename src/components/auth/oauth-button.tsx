"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { providers } from "@/types/auth-providers";

import { SocialProviderButton } from "./social-provider-button";

export function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  async function signIn(provider: string) {
    try {
      setLoadingProvider(provider);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message);
      }
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {providers.map((provider) => (
        <SocialProviderButton
          className="min-w-[180px] flex-1"
          key={provider.id}
          icon={provider.icon}
          name={provider.name}
          loading={loadingProvider === provider.id}
          onClick={() => signIn(provider.id)}
        />
      ))}
    </div>
  );
}
