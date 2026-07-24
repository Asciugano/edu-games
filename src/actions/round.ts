"use server";

import prisma from "@/lib/prisma";

export async function completeRound(
  roundId: string,
  result: { answer: any; isCorrect: boolean },
) {
  await prisma.round.update({
    where: { id: roundId },
    data: {
      answer: result.answer,
      isCorrect: result.isCorrect,
    },
  });
}
