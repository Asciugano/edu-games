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
              games.find((g) => g.id === round.type)?.shortLable ?? round.type,
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
  }));

  const accuracyChartConfig = {
    accuracy: {
      label: "Corrette",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

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
            <h2 className="text-2xl font-semibold">Andamento degli utenti</h2>
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                Controlla i dati degli utenti e le loro preferenze
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <AppBarChart
              title="Media delle risposte per gioco"
              description="Media delle risposte corrette di ogni gioco"
              chartData={accuracyChartData}
              chartConfig={accuracyChartConfig}
              xKey="accuracy"
              bars={[{ key: "corrects" }]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
