import { Trophy } from "lucide-react";
import PageHeader from "@/components/page-header";
import DailyChallengesCard from "@/components/challenge-card";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ChallengesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { user } = session;
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
    include: {
      challenge: true,
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msLeft = tomorrow.getTime() - Date.now();
  const totalSeconds = Math.floor(msLeft / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">
      <PageHeader
        title="Sfide giornaliere"
        subtitle="Completa le missioni di oggi e ottieni XP extra"
        icon={Trophy}
      />

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <DailyChallengesCard
            key={challenge.id}
            challenge={challenge.challenge}
            progress={challenge.progress}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Nuove sfide tra{" "}
        <span className="font-medium text-foreground">
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </p>
    </div>
  );
}
