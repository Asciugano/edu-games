import type { Metadata } from "next";
import { gameGenerators } from "@/lib/engines/generators";
import prisma from "@/lib/prisma";
import { GameRenderer } from "@/components/games/game-renderer";
import { ExerciseType } from "../../../../../../generated/prisma/enums";
import { GameHeader } from "@/components/game-header";
import { X } from "lucide-react";
import Link from "next/link";
import GameResultOverlay from "@/components/game-result/game-resutl-overlay";
import { finishGameSession } from "@/actions/game-sesison";
import { updateChallenge } from "@/actions/challenge";
import checkAchivements from "@/actions/achivements";

export const metadata: Metadata = {
  title: "Gioca",
};

export default async function PlayPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { rounds: true },
  });
  if (!session) return null;

  if (session.mode === "MIXED" || !session.selectedGame) {
    const types = Object.keys(gameGenerators) as ExerciseType[];
    session.selectedGame = types[Math.floor(Math.random() * types.length)];
  }

  const game = await gameGenerators[session.selectedGame]();

  const xp = Math.floor(
    session.rounds.filter((round) => round.isCorrect).length * 12,
  );
  if (session.rounds.length >= 10) {
    await Promise.all([
      finishGameSession(sessionId, xp),
      updateChallenge(sessionId),
      checkAchivements(),
    ]);

    return (
      <GameResultOverlay
        totalQuestions={10}
        xp={xp}
        correctAnswers={
          session.rounds.filter((round) => round.isCorrect).length
        }
        open={true}
      />
    );
  }

  const lastRound = session.rounds.at(-1);
  const round =
    !lastRound || lastRound.answer !== null
      ? await prisma.round.create({
          data: {
            sessionId,
            type: game.type,
          },
        })
      : lastRound;

  return (
    <div>
      <Link href="/dashboard" className="text-muted-foreground">
        <X />
      </Link>
      <div className="container mx-auto max-w-4xl space-y-8 py-8">
        {session.rounds.length < 10 && (
          <div>
            <GameHeader
              currentRound={session.rounds.length + 1}
              totalRounds={10}
              xp={xp}
              exercize={game.type}
            />
            <GameRenderer
              roundId={round.id}
              sessionId={sessionId}
              game={game.type}
              payload={game.payload}
              onComplete={async (result) => {
                "use server";

                await prisma.round.update({
                  where: { id: round.id },
                  data: {
                    answer: result.answer,
                    isCorrect: result.isCorrect,
                  },
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
