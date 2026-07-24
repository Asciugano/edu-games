"use client";

import { useState } from "react";

type Result = {
  xp: number;
  correctAnswers: number;
  totalQuestions: number;
};

export function useGameResult() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  function show(result: Result) {
    setResult(result);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  return {
    open,
    result,
    show,
    close,
  };
}
