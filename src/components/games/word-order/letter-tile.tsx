"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import type { LetterTile as Tile } from "@/types/games/games";

export function LetterTile({ id, letter }: Tile) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="h-14 w-14 text-2xl font-bold touch-none select-none"
      style={{
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      variant="outline"
      size="lg"
    >
      {letter}
    </Button>
  );
}
