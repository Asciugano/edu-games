"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DailyChallenge } from "../../generated/prisma/client";
import { Check, Flame, Gamepad2, Target, Trophy } from "lucide-react";
import { useMemo } from "react";

interface Props {
  challenge: DailyChallenge;
  progress: number;
}

export default function DailyChallengesCard({ challenge, progress }: Props) {
  const completed = progress >= challenge.target;
  const Icon = useMemo(() => {
    switch (challenge.type) {
      case "CORRECT_ANSWERS":
        return Target;
      case "GAMES_PLAYED":
        return Gamepad2;
      case "STREAK":
        return Flame;
    }
  }, [challenge.type]);

  const percentage = Math.min(
    Math.round((progress / challenge.target) * 100),
    100,
  );

  return (
    <Card
      className={`group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        completed ? "border-primary/30 bg-primary/5" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Icon className="size-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold text-lg leading-none">
                {challenge.title}
              </h2>

              <CardDescription className="mt-2">
                {challenge.description}
              </CardDescription>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border bg-muted px-3 py-1">
            <Trophy className="size-4 text-yellow-500" />
            <span className="text-sm font-medium">
              +{challenge.rewardXp} XP
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">
              {progress}
              <span className="ml-1 text-lg text-muted-foreground">
                / {challenge.target}
              </span>
            </p>

            <p className="text-xs text-muted-foreground">Progresso attuale</p>
          </div>

          <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {percentage}%
          </div>
        </div>

        <Progress value={percentage} className="h-2" />

        {completed ? (
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <Check className="size-4 text-primary" />

            <p className="text-sm font-medium text-primary">
              Sfida completata!
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              Ti mancano{" "}
              <span className="font-semibold text-foreground">
                {challenge.target - progress}
              </span>{" "}
              punti per completarla.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
