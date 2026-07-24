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
import { Circle, RectangleVertical, Triangle } from "lucide-react";
import { toast } from "sonner";

import type { ObjectCountPayload } from "@/types/games/games";
import { useRouter } from "next/navigation";
import { completeRound } from "@/actions/round";

export function CountObejctGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  payload: ObjectCountPayload;
  roundId: string;
  sessionId: string;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const router = useRouter();
  const ShapeIcon = useMemo(() => {
    switch (payload.name) {
      case "Triangle":
        return Triangle;
      case "Circle":
        return Circle;
      case "Rectangle":
        return RectangleVertical;
      default:
        return null;
    }
  }, [payload.name]);

  async function submit(number: number) {
    const result = {
      answer: number.toString(),
      isCorrect: number === payload.number,
    };
    if (!result.isCorrect) toast.error("Peccato... hai sbagliato");
    else toast("Bravo!!! la quantita' e' giusta");

    onComplete(result);
    await completeRound(roundId, result);
    router.refresh();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (/^[0-9]$/.test(e.key)) {
        const value = Number(e.key);
        if (payload.numbers.includes(value)) {
          e.preventDefault();
          submit(value);
        }

        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Costruisci la parola
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {payload.image && (
          <div className="flex justify-center">
            <Image
              src={payload.image}
              alt=""
              width={208}
              height={208}
              draggable={false}
              className="h-52 w-52 rounded-2xl border object-cover shadow-md"
            />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Forma</p>
          <div className="flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all">
            {ShapeIcon && <ShapeIcon className="h-12 w-12" />}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Risposta</p>
          <div className="flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all">
            {payload.numbers.map((n) => (
              <Button
                key={n}
                variant="outline"
                size="lg"
                className="h-14 w-14 text-2xl font-bold touch-none select-none"
                onClick={() => submit(n)}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center text-center">
        <p className="text-muted-foreground text-center text-xs">
          clicca il numero giusto
        </p>
      </CardFooter>
    </Card>
  );
}
