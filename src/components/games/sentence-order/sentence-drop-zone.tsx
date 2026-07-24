"use client";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function SentenceDropZone({
  id,
  title,
  children,
  isEmpty,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  isEmpty?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });
  const { over } = useDndContext();
  const isActive = over?.id === id;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-wrap justify-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all",
          isActive ? "border-primary bg-primary/5 scale-[1.01]" : "bg-muted/20",
        )}
      >
        {isEmpty && <div className="h-14 w-full opacity-0" />}
        {children}
      </div>
    </div>
  );
}
