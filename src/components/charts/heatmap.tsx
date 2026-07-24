"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipRow } from "@/components/toolip-row";

type HeatmapDay = {
  date: string;
  xp: number;
  games: number;
  correct: number;
};

type Props = {
  title: string;
  description?: string;
  data: HeatmapDay[];
};

function getIntensity(xp: number) {
  if (xp === 0) {
    return "bg-muted border";
  }

  if (xp < 25) {
    return "bg-chart-1/30";
  }

  if (xp < 50) {
    return "bg-chart-1/50";
  }

  if (xp < 100) {
    return "bg-chart-1/70";
  }

  return "bg-chart-1";
}

export default function AppHeatmap({ title, description, data }: Props) {
  const monthLabels: { month: string; column: number }[] = [];
  data.forEach((day, i) => {
    const date = new Date(day.date);

    if (date.getDate() === 1) {
      monthLabels.push({
        month: date.toLocaleDateString("it-IT", {
          month: "short",
        }),
        column: Math.floor(i / 7),
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-2">
              {/* Giorni della settimana */}
              <div className="mt-5 grid grid-rows-7 gap-1 text-xs text-muted-foreground">
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>G</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>

              <div>
                {/* Mesi */}
                <div
                  className="mb-2 grid text-xs text-muted-foreground"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil(
                      data.length / 7,
                    )}, 1rem)`,
                  }}
                >
                  {monthLabels.map((m) => (
                    <span
                      key={`${m.month}-${m.column}`}
                      style={{
                        gridColumnStart: m.column + 1,
                      }}
                    >
                      {m.month}
                    </span>
                  ))}
                </div>

                <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                  {data.map((day) => {
                    const formattedDate = new Date(day.date).toLocaleDateString(
                      "it-IT",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    );

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-4 w-4 rounded-sm transition-transform hover:scale-125 ${getIntensity(
                              day.xp,
                            )}`}
                          />
                        </TooltipTrigger>

                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          className="min-w-40 rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="border-b border-border/50 pb-1">
                              <span className="font-medium text-foreground">
                                {formattedDate}
                              </span>
                            </div>

                            <div className="grid gap-1.5">
                              <TooltipRow
                                color="var(--chart-1)"
                                label="XP"
                                value={day.xp}
                              />
                              <TooltipRow
                                color="var(--chart-2)"
                                label="Partite"
                                value={day.games}
                              />
                              <TooltipRow
                                color="var(--chart-3)"
                                label="Risposte corrette"
                                value={day.correct}
                              />
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Legenda */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Meno</span>
          <div className="h-3 w-3 rounded-sm border bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-chart-1/30" />
          <div className="h-3 w-3 rounded-sm bg-chart-1/50" />
          <div className="h-3 w-3 rounded-sm bg-chart-1/70" />
          <div className="h-3 w-3 rounded-sm bg-chart-1" />
          <span>Più</span>
        </div>
      </CardContent>
    </Card>
  );
}
