"use client";

import { useEffect, useState } from "react";
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

import type { WordImageMatchPayload } from "@/types/games/games";
import { Check, RotateCcw } from "lucide-react";
import { completeRound } from "@/actions/round";
import { useRouter } from "next/navigation";

export function WordImageMatchGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  payload: WordImageMatchPayload;
  roundId: string;
  sessionId: string;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const router = useRouter();

  async function submit() {
    const result = {
      answer: selectedWord,
      isCorrect: selectedWord.toLowerCase() === payload.word.toLowerCase(),
    };
    onComplete(result);

    if (!result.isCorrect) toast.error("Peccato... la parola non e' corretta");
    else toast("Bravo!!! la parola e'corretta");

    await completeRound(roundId, result);
    router.refresh();
  }

  const [selectedWord, setSelectedWord] = useState("");
  const [inputBuffer, setInputBuffer] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // INFO: evita che interferisca con input del browser
      const isTypingInInput =
        (e.target as HTMLElement)?.tagName === "INPUT" ||
        (e.target as HTMLElement)?.tagName === "TEXTAREA";

      if (isTypingInInput) return;

      if (e.key === "Backspace") {
        e.preventDefault();

        if (inputBuffer.length > 0) {
          setInputBuffer((prev) => prev.slice(0, -1));
          return;
        }

        setSelectedWord("");
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();

        if (inputBuffer.trim().length > 0) {
          setSelectedWord(inputBuffer.trim());
          setInputBuffer("");
          return;
        }

        submit();
        return;
      }

      // INFO: SPACE = commit parola
      if (e.key === " ") {
        e.preventDefault();

        const word = inputBuffer.trim();
        if (word) setSelectedWord(word);

        setInputBuffer("");
        return;
      }

      if (/^[a-zA-ZÀ-ÿ']$/.test(e.key)) {
        e.preventDefault();

        setInputBuffer((prev) => prev + e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inputBuffer]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Associa la parola
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
          <p className="text-sm font-medium text-muted-foreground">Risposta</p>
          <div className="flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all">
            {selectedWord.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="min-h-14 min-w-14 text-2xl font-bold touch-none select-none"
              >
                {selectedWord}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">parole</p>
          <div className="flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all">
            {payload.words.map((word) => (
              <Button
                key={word}
                variant="outline"
                size="lg"
                className="min-h-14 min-w-14 text-2xl font-bold touch-none select-none"
                onClick={() => setSelectedWord(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setSelectedWord("")}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button disabled={selectedWord.length === 0} onClick={submit}>
            <Check className="mr-2 h-4 w-4" />
            Controlla
          </Button>
        </div>
        {inputBuffer && (
          <div className="text-center text-sm text-muted-foreground">
            Stai scrivendo: <b>{inputBuffer}</b>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-center text-center">
        <p className="text-muted-foreground text-center text-xs">
          Suggerimento: puoi usare anche la tastiera. Premi{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5">⌫</kbd> per
          cancellare e{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5">Invio</kbd> per
          controllare la risposta.
        </p>
      </CardFooter>
    </Card>
  );
}
