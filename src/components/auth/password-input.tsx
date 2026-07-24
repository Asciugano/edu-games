"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function PasswordInput({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn("pr-10", className)}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        placeholder="*****"
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="text-muted-foreground w-4 h-4" />
        ) : (
          <Eye className="text-muted-foreground w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
