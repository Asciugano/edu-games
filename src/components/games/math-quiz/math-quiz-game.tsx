"use client";

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

    if (!result.isCorrect) {
      toast.error("Peccato... hai sbagliato");
    } else {
      toast.success("Bravo! Risposta corretta 🎉");
    }

    onComplete(result);
    await completeRound(roundId, result);
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          Quiz Matematica
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-10 pt-8">
        {/* Domanda */}
        <div className="space-y-3 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Risolvi l&apos;operazione
          </p>

          <div
            className="
              mx-auto flex h-32 max-w-md items-center justify-center
              rounded-2xl border
              from-primary/10 to-primary/5
              shadow-inner
            "
          >
            <p className="text-5xl font-black tracking-wider">
              {payload.operandA}{" "}
              <span className="text-primary">{payload.operation}</span>{" "}
              {payload.operandB}
            </p>
          </div>
        </div>

        {/* Risposte */}
        <div className="grid grid-cols-2 gap-4">
          {payload.choices.map((n) => (
            <Button
              key={n}
              size="lg"
              className="
              bg-muted
                h-20 rounded-xl
                text-3xl font-black
                transition-all
                hover:border-primary
                hover:bg-primary/10
                active:scale-95
              "
              onClick={() => submit(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Scegli il risultato corretto tra le opzioni
        </p>
      </CardFooter>
    </Card>
  );
}
