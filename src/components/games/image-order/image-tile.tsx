"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { ImageTile as Tile } from "@/types/games/games";
import Image from "next/image";

export function ImageTile({ id, image }: Tile) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Image
      src={image}
      alt=""
      height={208}
      width={208}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="min-h-14 min-w-14 text-2xl font-bold touch-none select-none"
      style={{
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    />
  );
}
