"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { completeRound } from "@/actions/round";
import { MathQuizPayload } from "@/types/games/games";

export function MathQuizGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  payload: MathQuizPayload;
  roundId: string;
  sessionId: string;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const router = useRouter();

  async function submit(number: number) {
    const result = {
      answer: number.toString(),
      isCorrect: number === payload.answer,
    };
    if (!result.isCorrect) toast.error("Peccato... hai sbagliato");
    else toast("Bravo!!! la quantita' e' giusta");

    onComplete(result);
    await completeRound(roundId, result);
    router.refresh();
  }

  return (
    <div className="rounded-2xl bg-muted/50 p-6">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Quanto fa?
      </p>

      <p className="mt-2 text-center text-4xl font-black">{`${payload.operandA} ${payload.operation} ${payload.operandB}`}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {payload.choices.map((answer) => (
          <Button
            key={answer}
            onClick={() => submit(answer)}
            className="rounded-xl border bg-background px-4 py-4 font-bold transition hover:border-primary hover:bg-primary/5"
          >
            {answer}
          </Button>
        ))}
      </div>
    </div>
  );
}
