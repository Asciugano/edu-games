"use client";

import { useMemo } from "react";

export type PasswordStrength =
  | "Molto Debole"
  | "Debole"
  | "Buona"
  | "Molto Buona"
  | "Forte";

export interface PasswordStrenghtResult {
  score: number;
  label: PasswordStrength;
  percentage: number;

  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowecase: boolean;
  hasNumber: boolean;
  hasSpecialChars: boolean;

  isValid: boolean;
}

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    const score = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChars,
    ].filter(Boolean).length;

    const label: PasswordStrength =
      score === 0
        ? "Molto Debole"
        : score === 1
          ? "Debole"
          : score === 2
            ? "Buona"
            : score === 3 || score === 4
              ? "Molto Buona"
              : "Forte";

    return {
      score,
      label,
      percentage: score * 20,

      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChars,

      isValid: score === 5,
    };
  }, [password]);
}
