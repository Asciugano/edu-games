"use client";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePasswordStrength } from "@/hooks/use-password-strength";

interface Props {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: Props) {
  const strength = usePasswordStrength(password);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Qualita&apos; password</span>

          <span
            className={cn(
              "font-medium",
              strength.score <= 1 && "text-destructive",
              strength.score === 2 && "text-orange-500",
              strength.score === 3 && "text-yellow-500",
              strength.score === 4 && "text-lime-500",
              strength.score === 5 && "text-primary",
            )}
          >
            {strength.label}
          </span>
        </div>

        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              strength.score <= 1 && "bg-destructive",
              strength.score === 2 && "bg-orange-500",
              strength.score === 3 && "bg-yellow-500",
              strength.score === 4 && "bg-lime-500",
              strength.score === 5 && "bg-green-600",
            )}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <Requirement valid={strength.hasMinLength} text="Almeno 6 caratteri" />

        <Requirement
          valid={strength.hasUppercase}
          text="Almeno una lettera maiuscola"
        />

        <Requirement
          valid={strength.hasLowercase}
          text="Almeno una lettera minuscola"
        />

        <Requirement valid={strength.hasNumber} text="Almeno un numero" />

        <Requirement
          valid={strength.hasSpecialChars}
          text="Almeno un carattere speciale"
        />
      </div>
    </div>
  );
}

interface RequirementProps {
  valid: boolean;
  text: string;
}

function Requirement({ valid, text }: RequirementProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        valid ? "text-primary" : "text-muted-foreground",
      )}
    >
      {valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}

      <span>{text}</span>
    </div>
  );
}
