"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={loading || disabled}>
      {loading && <Loader2 className="mr-2 size-4 animate-spin" />}

      {loading ? (loadingLabel ?? "Loading...") : label}
    </Button>
  );
}
