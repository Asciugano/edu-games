"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function updateChallenge(gameSessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  const { user } = session;

  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date();
  endDay.setHours(23, 59, 59, 999);

  const challenges = await prisma.userDailyChallenge.findMany({
    where: {
      userId: user.id,
      assignedDate: { gte: startDay, lte: endDay },
    },
    include: {
      challenge: true,
    },
  });
  const gameSession = await prisma.gameSession.findUnique({
    where: { id: gameSessionId },
    include: { rounds: true },
  });
  if (!gameSession) throw new Error("Invalid game session");

  let current = 0;
  let maxStreak = 0;

  for (const round of gameSession.rounds) {
    if (round.isCorrect) {
      current++;
      maxStreak = Math.max(maxStreak, current);
    } else {
      current = 0;
    }
  }
  maxStreak = Math.max(maxStreak, current);

  for (const challenge of challenges) {
    if (challenge.progress >= challenge.challenge.target) continue;

    let increment = 0;

    switch (challenge.challenge.type) {
      case "CORRECT_ANSWERS":
        increment = gameSession.score;
        break;

      case "STREAK":
        increment = maxStreak;
        break;
    }

    const newProgress = challenge.progress + increment;

    await prisma.userDailyChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        progress: newProgress,
      },
    });

    if (!challenge.completedAt && newProgress >= challenge.challenge.target) {
      await prisma.userDailyChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          completedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          totalXp: {
            increment: challenge.challenge.rewardXp,
          },
        },
      });
    }
  }
}

export async function assignChallenges() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
  const { user } = session;
  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date();
  endDay.setHours(23, 59, 59, 999);

  const alreadyAssigned = await prisma.userDailyChallenge.count({
    where: {
      userId: user.id,
      assignedDate: {
        gte: startDay,
        lte: endDay,
      },
    },
  });

  if (alreadyAssigned > 0) {
    return;
  }

  const challenges = await prisma.dailyChallenge.findMany();
  const selected = [...challenges].sort(() => Math.random() - 0.5).slice(0, 3);
  await prisma.userDailyChallenge.createMany({
    data: selected.map((challenge) => ({
      userId: user.id,
      challengeId: challenge.id,
    })),
  });
}
