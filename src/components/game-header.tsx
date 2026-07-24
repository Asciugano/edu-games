import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Props = {
  currentRound: number;
  totalRounds: number;
  xp: number;
};

export function GameHeader({ currentRound, totalRounds, xp }: Props) {
  const progress = (currentRound / totalRounds) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="size-5 text-primary" />
          <span className="font-semibold">{xp} XP</span>
        </div>

        <span className="text-sm text-muted-foreground">
          {currentRound}/{totalRounds}
        </span>
      </div>

      <Progress value={progress} />
    </div>
  );
}
