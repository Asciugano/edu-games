import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import StatCard from "@/components/stat-card";
import {
  Flame,
  Trophy,
  Star,
  Percent,
  CalendarDays,
  TrendingUp,
  Coins,
} from "lucide-react";
import AppAreaChart from "@/components/charts/app-area-chart";
import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import Heatmap from "@/components/charts/heatmap";
import AppRadarChart from "@/components/charts/app-radar-chart";
import { games } from "@/types/games/games";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { AppBarChart } from "@/components/charts/app-bar-chart";

export default async function ProgressPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;
  const { user } = session;

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
  const dailyStats = await prisma.dailyStat.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "asc",
    },
  });

  const rounds = await prisma.round.findMany({
    where: {
      session: {
        userId: user.id,
      },
      isCorrect: {
        not: null,
      },
    },
    select: {
      type: true,
      isCorrect: true,
      createdAt: true,
    },
  });
  const totalGames = rounds.length;

  const correctAnswers = rounds.filter((r) => r.isCorrect).length;

  const accuracy =
    totalGames === 0 ? 0 : Math.round((correctAnswers / totalGames) * 100);

  const activeDays = dailyStats.filter((d) => d.gamesPlayed > 0).length;
  const stats = {
    WORD_ORDER: { played: 0, correct: 0, wrong: 0 },
    SENTENCE_ORDER: { played: 0, correct: 0, wrong: 0 },
    IMAGE_ORDER: { played: 0, correct: 0, wrong: 0 },
    COUNT_OBJECTS: { played: 0, correct: 0, wrong: 0 },
    QUANTITY_COMPARISON: { played: 0, correct: 0, wrong: 0 },
    WORD_IMAGE_MATCH: { played: 0, correct: 0, wrong: 0 },
    MATH_QUIZ: { played: 0, correct: 0, wrong: 0 },
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthChartData = monthNames.map((month) => ({
    month,
    correct: 0,
    wrong: 0,
  }));

  for (const round of rounds) {
    stats[round.type as keyof typeof stats].played++;

    if (round.isCorrect) {
      stats[round.type as keyof typeof stats].correct++;
    } else {
      stats[round.type as keyof typeof stats].wrong++;
    }
  }

  for (const stat of dailyStats) {
    const monthIndex = stat.date.getMonth();
    monthChartData[monthIndex].correct += stat.correctAnswer;
    monthChartData[monthIndex].wrong += stat.wrongAnswer;
  }

  const monthChartConfig = {
    correct: {
      label: "Corrette",
      color: "var(--chart-1)",
    },
    wrong: {
      label: "Sbagliate",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const gameAccuracy = games.map((game) => ({
    title: game.title,
    accuracy:
      stats[game.id].played === 0
        ? 0
        : Math.round((stats[game.id].correct / stats[game.id].played) * 100),
  }));
  const strengths = [...gameAccuracy]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3);

  const weaknesses = [...gameAccuracy]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const xpChartData = dailyStats.map((day) => ({
    date: day.date.toISOString(),
    xp: day.earnedXp,
  }));

  const xpChartConfig = {
    xp: {
      label: "XP",
      color: "var(--chart-1)",
    },
    date: {
      label: "Data",
      color: "var(--chart-2)",
    },
  };

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
  return (
    <div className="space-y-6">
      <PageHeader
        title="Progressi"
        subtitle="Analizza le tue statistiche e scopri come stai migliorando nel tempo."
        icon={TrendingUp}
      />
      <div className="flex flex-wrap gap-3">
        <StatCard
          title="Serie Attuale"
          value={user.streak!}
          icon={Flame}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="XP Totali"
          value={user.totalXp!}
          icon={Trophy}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Sessioni"
          value={3}
          icon={Star}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          icon={Percent}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Giorni attivi"
          value={`${activeDays} giorni`}
          icon={CalendarDays}
          className="min-w-[180px] flex-1"
        />
        <StatCard
          title="Monete"
          value={user.coin ?? 0}
          icon={Coins}
          className="min-w-[180px] flex-1"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AppAreaChart
          title="Evoluzione XP"
          description="Andamento dell'esperienza nel tempo"
          xKey="date"
          areas={[
            {
              key: "xp",
              gradientId: "fillXp",
            },
          ]}
          chartData={xpChartData}
          chartConfig={xpChartConfig}
          xFormatter="date"
          tooltipFormatter="date"
        />

        <Card>
          <CardHeader>
            <CardTitle>Attività recenti</CardTitle>
            <CardDescription>Le tue ultime sessioni di gioco.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {dailyStats
              .slice(-7)
              .reverse()
              .map((day) => (
                <div
                  key={day.date.toISOString()}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {day.date.toLocaleDateString("it-IT")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.gamesPlayed} partite
                    </p>
                  </div>

                  <span className="font-bold text-chart-1">
                    +{day.earnedXp} XP
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AppRadarChart
          title="Prestazioni per gioco"
          description="Accuratezza per categoria"
          chartData={gamesChartData}
          chartConfig={gamesChartConfig}
        />

        {/* In futuro puoi mettere un PieChart corrette/sbagliate */}
        <Card>
          <CardHeader>
            <CardTitle>Accuratezza globale</CardTitle>
            <CardDescription>Distribuzione delle risposte.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Progress value={accuracy} className="h-3" />
            <div className="flex justify-between text-sm">
              <span>Corrette</span>
              <span className="font-medium">{accuracy}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <AppBarChart
        title="Risposte"
        description="Le tue risposte corrette e sbagliate nei mesi"
        chartConfig={monthChartConfig}
        chartData={monthChartData}
        xKey="month"
        bars={[
          {
            key: "correct",
          },
          { key: "wrong" },
        ]}
      />
      <Heatmap
        data={heatmapData}
        title="Attivita' annuale"
        description="I tuoi progressi degli ultimi 12 mesi"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          className={
            "group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          }
        >
          <CardHeader>
            <CardTitle>Punti di forza</CardTitle>
            <CardDescription>
              Le categorie in cui ottieni i risultati migliori.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {strengths.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between"
              >
                <span>{item.title}</span>
                <span className="font-medium">{item.accuracy}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          className={
            "group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          }
        >
          <CardHeader>
            <CardTitle>Aree da migliorare</CardTitle>
            <CardDescription>
              Prova ad allenarti di più in queste attività.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {weaknesses.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between"
              >
                <span>{item.title}</span>
                <span className="font-medium">{item.accuracy}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
