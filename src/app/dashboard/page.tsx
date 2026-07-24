import DailyChallengesCard from "@/components/challenge-card";
import AppAreaChart from "@/components/charts/app-area-chart";
import AppRadarChart from "@/components/charts/app-radar-chart";
import Heatmap from "@/components/charts/heatmap";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { games } from "@/types/games/games";
import { Flame, Percent, Star, Trophy } from "lucide-react";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;
  const { user } = session;

  const dailyStats = await prisma.dailyStat.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "asc",
    },
    take: 30,
  });
  const xpChartData = dailyStats.map((day) => ({
    date: day.date.toISOString(),
    xp: day.earnedXp,
  }));
  const xpChartConfig = {
    date: {
      label: "Data",
      color: "var(--chart-2)",
    },
    xp: {
      label: "XP",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const rounds = await prisma.round.findMany({
    where: {
      session: {
        userId: user.id,
      },
    },
    select: {
      type: true,
      isCorrect: true,
    },
  });

  const stats = {
    WORD_ORDER: { played: 0, correct: 0, wrong: 0 },
    SENTENCE_ORDER: { played: 0, correct: 0, wrong: 0 },
    IMAGE_ORDER: { played: 0, correct: 0, wrong: 0 },
    COUNT_OBJECTS: { played: 0, correct: 0, wrong: 0 },
    QUANTITY_COMPARISON: { played: 0, correct: 0, wrong: 0 },
    WORD_IMAGE_MATCH: { played: 0, correct: 0, wrong: 0 },
  };

  for (const round of rounds) {
    stats[round.type as keyof typeof stats].played++;

    if (round.isCorrect) {
      stats[round.type as keyof typeof stats].correct++;
    } else {
      stats[round.type as keyof typeof stats].wrong++;
    }
  }

  const gamesChartData = games.map((game) => ({
    game: game.shortLabel,
    title: game.title,
    played: stats[game.id].played,
    correct: stats[game.id].correct,
    wrong: stats[game.id].wrong,
  }));
  const gamesChartConfig = {
    played: {
      label: "Giocati",
      color: "hsl(var(--chart-1))",
    },
    correct: {
      label: "Corretti",
      color: "hsl(var(--chart-2))",
    },
    wrong: {
      label: "Sbagliati",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const today = new Date();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const dailyStatsH = await prisma.dailyStat.findMany({
    where: {
      userId: user.id,
      date: {
        gte: oneYearAgo,
      },
    },
  });

  const statsMap = new Map(
    dailyStatsH.map((day) => [day.date.toISOString().slice(0, 10), day]),
  );

  const heatmapData = [];

  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const current = new Date(d);
    const key = current.toISOString().slice(0, 10);
    const stat = statsMap.get(key);

    heatmapData.push({
      date: key,
      xp: stat?.earnedXp ?? 0,
      games: stat?.gamesPlayed ?? 0,
      correct: stat?.correctAnswer ?? 0,
    });
  }

  const totalXp = await prisma.dailyStat.aggregate({
    where: { userId: user.id },
    _sum: {
      earnedXp: true,
    },
  });

  if (user.totalXp !== totalXp._sum.earnedXp)
    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: totalXp._sum.earnedXp ?? 0 },
    });
  const totalGames = await prisma.round.count({
    where: {
      session: {
        userId: user.id,
      },
    },
  });
  const correct = rounds.filter((r) => r.isCorrect).length;
  const accuracy =
    rounds.length === 0 ? 0 : Math.round((correct / rounds.length) * 100);

  const favoriteGame = gamesChartData.reduce((a, b) =>
    a.played > b.played ? a : b,
  );

  const favoriteAccuracy =
    favoriteGame.played === 0
      ? 0
      : Math.round((favoriteGame.correct / favoriteGame.played) * 100);

  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date();
  endDay.setHours(23, 59, 59, 999);

  const challenges = await prisma.userDailyChallenge.findMany({
    where: {
      userId: user.id,
      assignedDate: {
        gte: startDay,
        lte: endDay,
      },
    },
    include: { challenge: true },
  });

  const incompleteChallenges = challenges.filter(
    (c) => c.progress < c.challenge.target,
  );

  const challenge =
    incompleteChallenges.length > 0
      ? incompleteChallenges[
          Math.floor(Math.random() * incompleteChallenges.length)
        ]
      : challenges[Math.floor(Math.random() * challenges.length)];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard">
        <p className="text-muted-foreground">
          Bentornato,{" "}
          <span className="font-medium text-foreground">{user.name}</span>!
          Continua così, sei al livello{" "}
          <span className="font-semibold">{user.level}</span>.
        </p>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <StatCard
          title="Serie Attuale"
          value={user.streak!}
          icon={Flame}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="XP"
          value={totalXp._sum.earnedXp ?? 0}
          icon={Trophy}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Partite"
          value={totalGames}
          icon={Star}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          icon={Percent}
          className="min-w-[180px] flex-1"
        />
      </div>

      {/* INFO: 
          +----------------------------------------------------------+
          | Dashboard                                  Welcome 👋    |
          +----------------------------------------------------------+
          +---------+---------+---------+---------+
          | XP Tot. | Partite | Accuracy| Streak  |
          +---------+---------+---------+---------+
          +-------------------------+-----------------------------+
          | Grafico XP              | Radar Giochi               |
          +-------------------------+-----------------------------+
          +----------------------------------------------------------+
          | Heatmap annuale                                          |
          +----------------------------------------------------------+
          +-------------------------+-----------------------------+
          | Gioco preferito         | Obiettivo giornaliero       |
          +-------------------------+-----------------------------+
          +-------------------------+-----------------------------+
          | Punti di forza          | Ultime attività             |
          +-------------------------+-----------------------------+ 
        */}

      <div className="grid grid-cols-2 gap-4">
        <AppAreaChart
          title="XP"
          description="XP ultimi 30 giorni"
          chartData={xpChartData}
          chartConfig={xpChartConfig}
          xKey="date"
          areas={[
            {
              key: "xp",
              gradientId: "fillXp",
            },
          ]}
          xFormatter="date"
          tooltipFormatter="date"
        />
        <AppRadarChart
          title="Giochi"
          description="Quante volte hai giocato ad un gioco?"
          chartConfig={gamesChartConfig}
          chartData={gamesChartData}
        />
      </div>

      <Heatmap
        data={heatmapData}
        title="Attivita' annuale"
        description="I tuoi progressi degli ultimi 12 mesi"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <h3 className="font-semibold">Gioco preferito</h3>
              <CardDescription>Quello a cui hai giocato di più</CardDescription>
            </div>

            <div className="rounded-lg bg-chart-1/10 p-2">
              <Star className="h-5 w-5 text-chart-1" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{favoriteGame.title}</p>
              <p className="text-sm text-muted-foreground">
                {favoriteGame.played} partite completate
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuratezza</span>

                <span className="font-medium">{favoriteAccuracy}%</span>
              </div>

              <Progress value={favoriteAccuracy} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <DailyChallengesCard
          challenge={challenge.challenge}
          progress={challenge.progress}
        />
      </div>
    </div>
  );
}
