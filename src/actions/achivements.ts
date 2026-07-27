"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function checkAchivements() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const { user } = session;

  const achivements = await prisma.achievement.findMany({
    where: {
      userAchievements: {
        none: {
          userId: user.id,
        },
      },
    },
  });

  const gamesPlayed = await prisma.gameSession.count({
    where: {
      userId: user.id,
      finishedAt: {
        not: null,
      },
    },
  });

  const correct = await prisma.round.count({
    where: {
      session: {
        userId: user.id,
      },
      isCorrect: true,
    },
  });

  const perfects = await prisma.gameSession.findMany({
    where: {
      userId: user.id,
      finishedAt: {
        not: null,
      },
    },
    include: {
      rounds: {
        select: {
          isCorrect: true,
        },
      },
    },
  });
  const perfectLessons = perfects.filter(
    (perfects) =>
      perfects.rounds.length > 0 &&
      perfects.rounds.every((round) => round.isCorrect === true),
  ).length;

  for (const achivement of achivements) {
    let unlocked = false;
    switch (achivement.type) {
      case "LEVEL":
        unlocked = (user.level ?? 0) >= achivement.goal;
        break;
      case "STREAK":
        unlocked = (user.streak ?? 0) >= achivement.goal;
        break;
      case "CORRECT_ANSWERS":
        unlocked = correct >= achivement.goal;
        break;
      case "GAMES_PLAYED":
        unlocked = gamesPlayed >= achivement.goal;
        break;
      case "PERFECT_LESSONS":
        unlocked = perfectLessons >= achivement.goal;
        break;
    }

    if (unlocked) await grantAchivement(achivement.id, user.id);
  }
}

export async function grantAchivement(achivementId: string, userId: string) {
  const achievement = await prisma.achievement.findUnique({
    where: {
      id: achivementId,
    },
    include: {
      badge: true,
    },
  });

  if (!achievement) return;

  const alreadyUnlocked = await prisma.userAchievement.findUnique({
    where: {
      userId_achivementId: {
        userId,
        achivementId: achievement.id,
      },
    },
  });

  if (alreadyUnlocked) return;

  await prisma.$transaction(async (tx) => {
    await tx.userAchievement.create({
      data: {
        userId,
        achivementId: achievement.id,
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        coin: {
          increment: achievement.rewardCoin,
        },
      },
    });
  });
}
