"use client";

import { gameModes } from "@/types/games/modes";
import { Play } from "lucide-react";
import { useState } from "react";
import { ExerciseType, GameMode } from "../../generated/prisma/enums";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useRouter } from "next/navigation";
import { createGameSession } from "@/actions/game";
import { games } from "@/types/games/games";

export default function GameModeSelector() {
  const [selectedMode, setSelectedMode] = useState<string>(GameMode.MIXED);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <Card className="border-none bg-muted/20 shadow-none">
        <CardHeader>
          <h2 className="text-xl font-semibold">Modalità di gioco</h2>
          <p className="text-sm text-muted-foreground">Scegli come giocare</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {gameModes.map((mode) => (
              <Card
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${selectedMode === mode.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""}`}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-2xl bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                    <mode.icon className="size-7 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold">{mode.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedMode === GameMode.SINGLE && (
        <Card className="group cursor-pointer transition-all hover:shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">I nostri Giochi</h2>
            <p className="text-sm text-muted-foreground">
              Scegli il gioco che preferisci
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {games.map((game) => (
                <Card
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-1.5 hover:border-primary/20 hover:ring-2 hover:ring-primary/20 ${
                    selectedGame === game.id
                      ? "border-primary ring-2 ring-primary/40"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <h2 className="font-semibold">{game.title}</h2>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="sticky bottom-4 mx-auto max-w-md border-primary/20 bg-card/80 backdrop-blur">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium">
              {selectedMode === GameMode.MIXED
                ? "Modalità Mista"
                : selectedGame
                  ? games.find((g) => g.id === selectedGame)?.title
                  : "Seleziona un gioco"}
            </p>
            <p className="text-xs text-muted-foreground">10 round • +120 XP</p>
          </div>

          <Button
            size="lg"
            disabled={selectedMode === GameMode.SINGLE && !selectedGame}
            onClick={async () => {
              const sessionId = await createGameSession(
                selectedMode as GameMode,
                selectedGame as ExerciseType,
              );
              router.push(`/dashboard/games/${sessionId}/play`);
            }}
          >
            <Play className="mr-2 size-4 text-white" fill="white" />
            Inizia
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
