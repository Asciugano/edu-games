import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ExerciseType } from "../../generated/prisma/enums";
import { games } from "@/types/games/games";

type Props = {
  currentRound: number;
  totalRounds: number;
  exercize: ExerciseType;
  xp: number;
};

export function GameHeader({ currentRound, totalRounds, xp, exercize }: Props) {
  const progress = (currentRound / totalRounds) * 100;
  const game = games.find((g) => g.id === exercize);
  if (!game) return null;

  const Icon = game.icon;

  return (
    <div className="space-y-4 mb-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>

          <div>
            <p className="font-bold">{game.title}</p>

            <p className="text-xs text-muted-foreground">{`Domanda ${currentRound} di ${totalRounds}`}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold text-primary">
          <Star className="size-5 fill-current" />
          {xp} XP
        </div>
      </div>

      <Progress value={progress} className="h-2" />
    </div>
  );
}
