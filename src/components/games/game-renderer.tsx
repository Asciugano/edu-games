"use client";

import { gameRegistry } from "@/lib/engines/registry";

export function GameRenderer({
  roundId,
  sessionId,
  game,
  payload,
  onComplete,
}: {
  game: keyof typeof gameRegistry;
  roundId: string;
  sessionId: string;
  payload: any;
  onComplete: (r: any) => void;
}) {
  const Component = gameRegistry[game];

  if (!Component) return <div>Game not found</div>;

  return (
    <Component
      sessionId={sessionId}
      roundId={roundId}
      payload={payload}
      onComplete={onComplete}
    />
  );
}
