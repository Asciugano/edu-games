"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { LetterTile } from "./letter-tile";
import { LetterDropZone } from "./letter-drop-zone";

import type { LetterTile as Tile, WordOrderPayload } from "@/types/games/games";
import { useRouter } from "next/navigation";
import { completeRound } from "@/actions/round";

export function WordOrderGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  roundId: string;
  sessionId: string;
  payload: WordOrderPayload;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const router = useRouter();

  const [tiles] = useState<Tile[]>(() =>
    payload.letters.map((letter) => ({
      id: crypto.randomUUID(),
      letter,
      zone: "available",
    })),
  );

  const collisionDetectionStrategy = useCallback(
    (args: Parameters<typeof pointerWithin>[0]) => {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) return pointerCollisions;

      // Fallback a rectIntersection per i tile
      return rectIntersection(args);
    },
    [],
  );
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
  );

  const availableTiles = useMemo(
    () => tiles.filter((t) => !answerIds.includes(t.id)),
    [tiles, answerIds],
  );

  const answerTiles = useMemo(
    () =>
      answerIds.map((id) => tiles.find((t) => t.id === id)!).filter(Boolean),
    [tiles, answerIds],
  );

  const availableIdsMemo = useMemo(
    () => availableTiles.map((t) => t.id),
    [availableTiles],
  );

  const answerIdsMemo = useMemo(
    () => answerTiles.map((t) => t.id),
    [answerTiles],
  );

  function findTile(id: string) {
    return tiles.find((t) => t.id === id);
  }

  async function submit() {
    const result = answerTiles.map((t) => t.letter).join("");
    const isCorrect = result.toLowerCase() === payload.word.toLowerCase();

    if (!isCorrect) toast.error("Peccato... La parola non e' giusta");
    else toast("Bravo!!! La parola e' corretta");

    const gameResult = {
      answer: result,
      isCorrect,
    };

    onComplete(gameResult);

    await completeRound(roundId, gameResult);
    router.refresh();
  }

  function addLetter(char: string) {
    const tile = availableTiles.find(
      (t) => t.letter.toLowerCase() === char.toLowerCase(),
    );
    if (!tile) return;
    setAnswerIds((prev) => [...prev, tile.id]);
  }

  function removeLast() {
    setAnswerIds((prev) => prev.slice(0, -1));
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveInAnswer = answerIds.includes(activeId);
    const isOverInAnswer = answerIds.includes(overId);

    if (overId === "answer" || isOverInAnswer) {
      if (!isActiveInAnswer) {
        setAnswerIds((prev) => {
          if (overId === "answer") return [...prev, activeId];
          const overIndex = prev.indexOf(overId);
          const copy = [...prev];
          copy.splice(overIndex, 0, activeId);
          return copy;
        });
      } else {
        setAnswerIds((prev) => {
          const oldIndex = prev.indexOf(activeId);
          const newIndex = prev.indexOf(overId);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }

    if (overId === "available" || availableIdsMemo.includes(overId)) {
      if (isActiveInAnswer) {
        setAnswerIds((prev) => prev.filter((id) => id !== activeId));
      }
    }
  }

  function onDragEnd(_: DragEndEvent) {
    setActiveId(null);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        removeLast();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        submit();
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        addLetter(e.key);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [availableTiles, answerIds]);

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

        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <LetterDropZone
            id="answer"
            title="Risposta"
            isEmpty={answerTiles.length === 0}
          >
            <SortableContext
              items={answerIdsMemo}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap justify-center gap-3 min-w-[200px]">
                {answerTiles.map((tile) => (
                  <LetterTile key={tile.id} {...tile} />
                ))}
              </div>
            </SortableContext>
          </LetterDropZone>

          <LetterDropZone
            id="available"
            title="Lettere"
            isEmpty={availableTiles.length === 0}
          >
            <SortableContext
              items={availableIdsMemo}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap justify-center gap-3 min-w-[200px]">
                {availableTiles.map((tile) => (
                  <LetterTile key={tile.id} {...tile} />
                ))}
              </div>
            </SortableContext>
          </LetterDropZone>

          {/* DRAG PREVIEW */}
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-background text-2xl font-bold shadow-xl">
                {findTile(activeId)?.letter}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setAnswerIds([])}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button disabled={availableTiles.length !== 0} onClick={submit}>
            <Check className="mr-2 h-4 w-4" />
            Controlla
          </Button>
        </div>
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
