"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

import Image from "next/image";

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

import { ImageTile } from "./image-tile";
import { ImageDropZone } from "./image-drop-zone";

import type { ImageOrderPayload, ImageTile as Tile } from "@/types/games/games";
import { completeRound } from "@/actions/round";
import { useRouter } from "next/navigation";

export function ImageOrderGame({
  payload,
  roundId,
  sessionId,
  onComplete,
}: {
  payload: ImageOrderPayload;
  roundId: string;
  sessionId: string;
  onComplete: (res: { isCorrect: boolean; answer: string }) => void;
}) {
  const [tiles] = useState<Tile[]>(() =>
    payload.images.map((image) => ({
      id: crypto.randomUUID(),
      image,
      zone: "available",
    })),
  );

  const collisionDetectionStrategy = useCallback(
    (args: Parameters<typeof pointerWithin>[0]) => {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) return pointerCollisions;

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

  const router = useRouter();

  async function submit() {
    const result = answerTiles
      .map((t) => t.image)
      .join(" ")
      .trim();

    const gameResutl = {
      answer: result,
      isCorrect: result.toLowerCase() === payload.order.join(" ").trim(),
    };
    if (!gameResutl.isCorrect)
      toast.error("Peccato... La sequenza non e' corretta");
    else toast("Bravo!! la sequenza e' giusta");
    onComplete(gameResutl);

    await completeRound(roundId, gameResutl);

    router.refresh();
  }

  function addWord(buffer: string) {
    const tile = availableTiles.find(
      (t) => t.image.toLowerCase() === buffer.toLowerCase(),
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

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [grabbedIndex, setGrabbedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();

          if (grabbedIndex === null) {
            setFocusedIndex((i) => Math.max(0, i - 1));
          } else if (grabbedIndex > 0) {
            setAnswerIds((prev) =>
              arrayMove(prev, grabbedIndex, grabbedIndex - 1),
            );
            setGrabbedIndex(grabbedIndex - 1);
            setFocusedIndex(grabbedIndex - 1);
          }
          break;

        case "ArrowRight":
          e.preventDefault();

          if (grabbedIndex === null) {
            setFocusedIndex((i) => Math.min(answerIds.length - 1, i + 1));
          } else if (grabbedIndex < answerIds.length - 1) {
            setAnswerIds((prev) =>
              arrayMove(prev, grabbedIndex, grabbedIndex + 1),
            );
            setGrabbedIndex(grabbedIndex + 1);
            setFocusedIndex(grabbedIndex + 1);
          }
          break;

        case " ":
          e.preventDefault();

          if (grabbedIndex === null) {
            setGrabbedIndex(focusedIndex);
          } else {
            setGrabbedIndex(null);
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [availableTiles, answerIds, grabbedIndex, focusedIndex]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Riordina le Foto</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex justify-center text-center">
          <h2>{payload.title}</h2>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <ImageDropZone
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
                  <ImageTile key={tile.id} {...tile} />
                ))}
              </div>
            </SortableContext>
          </ImageDropZone>

          <ImageDropZone
            id="available"
            title="Image"
            isEmpty={availableTiles.length === 0}
          >
            <SortableContext
              items={availableIdsMemo}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap justify-center gap-3 min-w-[200px]">
                {availableTiles.map((tile) => (
                  <ImageTile key={tile.id} {...tile} />
                ))}
              </div>
            </SortableContext>
          </ImageDropZone>

          {/* DRAG PREVIEW */}
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              <div className="flex min-h-14 min-w-14 items-center justify-center rounded-lg border bg-background text-2xl font-bold shadow-xl">
                <Image
                  src={findTile(activeId)!.image}
                  alt=""
                  width={208}
                  height={208}
                />
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
