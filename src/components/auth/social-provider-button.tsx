"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SocialProviderButtonProps {
  icon: React.ElementType;
  name: string;
  loading?: boolean;
  onClick: () => void | Promise<void>;
  className?: string;
}

export function SocialProviderButton({
  icon: Icon,
  name,
  loading = false,
  onClick,
  className,
}: SocialProviderButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className={className}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Icon className="size-4" />
      )}
      Continua con {name}
    </Button>
  );
}
