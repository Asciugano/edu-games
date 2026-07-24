"use server";

import prisma from "@/lib/prisma";

export async function finishGameSession(sessionId: string, xp: number) {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { rounds: true, user: true },
  });
  if (!session) return null;

  const correctAnswers = session.rounds.filter(
    (round) => round.isCorrect,
  ).length;

  const newTotalXp = session.user.totalXp + xp;

  let necessaryXp = session.user.level * (session.user.level - 1) * 50;
  let newLevel = session.user.level;

  while (newTotalXp >= necessaryXp) {
    newLevel++;
    necessaryXp = newLevel * (newLevel - 1) * 50;
  }

  const lastSession = await prisma.gameSession.findFirst({
    where: {
      userId: session.userId,
      finishedAt: {
        not: null,
      },
      id: {
        not: session.id,
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 1;

  if (lastSession?.finishedAt) {
    const last = new Date(lastSession.finishedAt);
    last.setHours(0, 0, 0, 0);

    const diffDays = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      streak = session.user.streak; // già giocato oggi
    } else if (diffDays === 1) {
      streak = session.user.streak + 1;
    }
  }

  const wrongAnswers = 10 - correctAnswers;

  await prisma.$transaction(async (tx) => {
    await tx.gameSession.update({
      where: { id: sessionId },
      data: {
        score: correctAnswers,
        xp,
        finishedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: session.userId },
      data: {
        totalXp: newTotalXp,
        level: newLevel,
        streak,
      },
    });
    await tx.dailyStat.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date: today,
        },
      },
      update: {
        gamesPlayed: {
          increment: 1,
        },
        correctAnswer: {
          increment: correctAnswers,
        },
        wrongAnswer: {
          increment: wrongAnswers,
        },
        earnedXp: {
          increment: xp,
        },
      },
      create: {
        userId: session.userId,
        date: today,
        gamesPlayed: 1,
        correctAnswer: correctAnswers,
        wrongAnswer: wrongAnswers,
        earnedXp: xp,
      },
    });
  });
}
