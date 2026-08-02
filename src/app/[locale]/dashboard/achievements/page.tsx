import { AchivementCard } from "@/components/achivement-card";
import PageHeader from "@/components/page-header";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Gift } from "lucide-react";
import { headers } from "next/headers";

export default async function AchivementsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const { user } = session;

  const achievements = await prisma.achievement.findMany({
    include: {
      badge: true,
      userAchievements: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <PageHeader
        title="Premi"
        subtitle={`Ecco tutti i tuoi premi ${user.name}`}
        icon={Gift}
      />

      {achievements.length === 0 ? (
        <div className="">
          <p className="font-semibold text-xl text-muted-foreground">
            Ancora nessun premio, gioca qualche partita e&apos; ottienine
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {achievements.map((achivement) => (
            <AchivementCard
              key={achivement.id}
              achivement={achivement}
              unlockedAt={
                achivement.userAchievements.find(
                  (userAchivement) =>
                    userAchivement.achivementId === achivement.id,
                )?.unlockedAt
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
