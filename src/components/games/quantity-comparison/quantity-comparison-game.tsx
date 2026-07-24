"use client";

import { useEffect } from "react";
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

import type { QuantityComparisonPayload } from "@/types/games/games";
import { useRouter } from "next/navigation";
import { completeRound } from "@/actions/round";

export function QuantityComparisonGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  payload: QuantityComparisonPayload;
  roundId: string;
  sessionId: string;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const router = useRouter();

  async function submit(image: string) {
    const result = {
      answer: image,
      isCorrect: image === payload.answer,
    };
    if (!result.isCorrect) toast.error("Peccato... non e' giusto");
    else toast("Bravo!!! e' corretto");

    onComplete(result);
    await completeRound(roundId, result);

    router.refresh();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (/^[1-2]$/.test(e.key)) {
        submit(payload.images[Number(e.key) - 1]);
      }

      return;
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Tanti o Pochi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex justify-center">{payload.quantity}</div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Immagini</p>
          <div className="flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all">
            <div className="flex items-center gap-5">
              {payload.images.map((img, index) => (
                <Button
                  key={img}
                  variant="outline"
                  className="h-auto overflow-hidden rounded-xl p-2 transition-all hover:scale-[1.02] hover:border-primary"
                  onClick={() => submit(img)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={img}
                      alt=""
                      width={160}
                      height={160}
                      draggable={false}
                      className="aspect-square h-32 w-32 rounded-lg object-cover md:h-40 md:w-40"
                    />

                    <span className="text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center text-center">
        <p className="text-muted-foreground text-center text-xs">
          clicca l&apos;immagine giusta
        </p>
      </CardFooter>
    </Card>
  );
}
