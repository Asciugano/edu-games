"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExerciseType, GameMode } from "../../generated/prisma/enums";

export async function createGameSession(
  mode: GameMode,
  selectedGame?: ExerciseType,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const gameSession = await prisma.gameSession.create({
    data: {
      userId: session.user.id,
      mode,
      selectedGame,
    },
  });

  return gameSession.id;
}

export async function getOpenGameSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const openSession = await prisma.gameSession.findFirst({
    where: {
      finishedAt: null,
    },
  });

  if (!openSession)
    throw new Error("Nessuna sessione aperta! Inizia una nuova partita");

  return openSession.id;
}
