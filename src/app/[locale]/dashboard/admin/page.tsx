import { getUsersChart } from "@/actions/user";
import { AdminUserChart } from "@/components/admin/users/admin-user-chart";
import { AppBarChart } from "@/components/charts/app-bar-chart";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { games } from "@/types/games/games";
import { LockKeyhole, User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GameMode } from "../../../../generated/prisma/enums";

const sections = [
  {
    id: "users",
    title: "Utenti",
    icon: User,
    subtitle: "Controlla i dati degli utenti e le loro preferenze",
  },
  {
    id: "games",
    title: "Giochi",
    icon: User,
    subtitle: "",
  },
];

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;
  const { user } = session;
  if (user.role !== "ADMIN") redirect("/dashboard");

  const initialUsersChart = await getUsersChart("90d");

  const rounds = await prisma.round.groupBy({
    by: ["type"],
    _count: {
      id: true,
    },
  });

  const gamesChartData = rounds.map((round) => ({
    game: games.find((g) => g.id === round.type)?.shortLabel,
    played: round._count.id,
  }));
  const gameChartConfig = {
    played: {
      label: "Partite",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const onlineUsers = await prisma.user.aggregate({
    where: {
      lastActivityAt: { gte: fiveMinutesAgo },
      id: { not: user.id },
    },
    _count: {
      id: true,
    },
  });

  const roundAccuracy = await prisma.round.findMany({
    select: {
      type: true,
      isCorrect: true,
    },
  });

  const accuracyChartData = Object.values(
    roundAccuracy.reduce(
      (acc, round) => {
        if (!acc[round.type]) {
          acc[round.type] = {
            game:
              games.find((g) => g.id === round.type)?.shortLabel ?? round.type,
            correct: 0,
            total: 0,
          };
        }

        acc[round.type].total++;

        if (round.isCorrect) {
          acc[round.type].correct++;
        }

        return acc;
      },
      {} as Record<string, { game: string; correct: number; total: number }>,
    ),
  ).map((game) => ({
    game: game.game,
    accuracy: Math.round((game.correct / game.total) * 100),
    total: game.total,
  }));

  const accuracyChartConfig = {
    accuracy: {
      label: "Corrette",
      color: "var(--chart-4)",
    },
    game: {
      label: "Giochi",
      color: "var(--chart-3)",
    },
    total: {
      label: "Partite",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const gameSession = await prisma.gameSession.findMany({
    where: {
      finishedAt: {
        not: null,
      },
    },
    select: {
      startedAt: true,
      finishedAt: true,
      rounds: {
        select: {
          type: true,
        },
      },
    },
  });

  const avgTimeChartData = Object.values(
    gameSession.reduce(
      (acc, session) => {
        if (!session.finishedAt || session.rounds.length === 0) {
          return acc;
        }

        const duration =
          session.finishedAt.getTime() - session.startedAt.getTime();

        const durationPerRound = duration / session.rounds.length;

        for (const round of session.rounds) {
          if (!acc[round.type]) {
            acc[round.type] = {
              game:
                games.find((g) => g.id === round.type)?.shortLabel ??
                round.type,
              totalDuration: 0,
              rounds: 0,
            };
          }

          acc[round.type].totalDuration += durationPerRound;
          acc[round.type].rounds++;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          game: string;
          totalDuration: number;
          rounds: number;
        }
      >,
    ),
  ).map((game) => ({
    game: game.game,
    avgTime: Math.round(game.totalDuration / game.rounds / 1000), // secondi
  }));

  const avgTimeChartConfig = {
    game: {
      label: "Gioco",
      color: "var(--chart-2)",
    },
    avgTime: {
      label: "Durata media",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const favouriteMode = await prisma.gameSession.groupBy({
    by: ["mode"],
    _count: {
      id: true,
    },
  });

  const favouriteChartData = Object.values(GameMode).map((mode) => {
    const stat = favouriteMode.find((s) => s.mode === mode);

    return {
      mode: mode.toLowerCase(),
      played: stat?._count.id ?? 0,
    };
  });

  const favouriteChartConfig = {
    mode: {
      label: "Modalita'",
      color: "var(--chart-2)",
    },
    played: {
      label: "Partite",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayGames = await prisma.gameSession.count({
    where: {
      startedAt: {
        gte: today,
      },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Visualizza e gestisci i dati che ti servono"
        icon={LockKeyhole}
        dontShowLevel
      />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-6 h-fit">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <a href={`#${section.id}`}>
                      <section.icon className="size-4" />
                      {section.title}
                    </a>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-8">
          <Card id="users">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Andamento degli utenti</h2>
              <CardDescription>
                <p className="text-sm text-muted-foreground">
                  Controlla i dati degli utenti e le loro preferenze
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Utenti online:{" "}
                  <span
                    className={`text-2xl font-bold ${onlineUsers._count.id > 0 ? "text-primary" : "text-red-500"}`}
                  >
                    {onlineUsers._count.id}
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tu non sei contato
                </p>
              </div>
              <AdminUserChart initialUsersChart={initialUsersChart} />
              <AppBarChart
                title="Giochi piu' giocati"
                description="I giochi sono i piu' giocati dagli utenti"
                chartData={gamesChartData}
                chartConfig={gameChartConfig}
                xKey="game"
                bars={[{ key: "played" }]}
                tooltipFormatter="games"
              />
            </CardContent>
          </Card>
          <Card id="games">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Andamento dei giochi</h2>
              <CardDescription>
                <p className="text-sm text-muted-foreground">
                  Controlla controlla come vanno i giochi per gli utenti
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Partite giocate oggi:{" "}
                  <span
                    className={`text-2xl font-bold ${todayGames > 0 ? "text-primary" : "text-red-500"}`}
                  >
                    {todayGames}
                  </span>
                </h2>
              </div>
              <AppBarChart
                title="Media delle risposte per gioco"
                description="Media delle risposte corrette di ogni gioco"
                chartData={accuracyChartData}
                chartConfig={accuracyChartConfig}
                xKey="game"
                bars={[{ key: "game" }, { key: "accuracy" }, { key: "total" }]}
              />
              <AppBarChart
                title="Tempo medio per partita"
                description="Tempo medio per ogni gioco"
                chartData={avgTimeChartData}
                chartConfig={avgTimeChartConfig}
                xKey="game"
                bars={[{ key: "game" }, { key: "avgTime" }]}
              />
              <AppBarChart
                title="Modalita' prefetita"
                description="Numero delle partite in base alla modalita' scelta"
                chartData={favouriteChartData}
                chartConfig={favouriteChartConfig}
                xKey="mode"
                bars={[{ key: "played" }]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
