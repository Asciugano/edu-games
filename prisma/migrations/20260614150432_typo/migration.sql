/*
  Warnings:

  - You are about to drop the `gmae_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gmae_session" DROP CONSTRAINT "gmae_session_userId_fkey";

-- DropForeignKey
ALTER TABLE "round" DROP CONSTRAINT "round_sessionId_fkey";

-- DropTable
DROP TABLE "gmae_session";

-- CreateTable
CREATE TABLE "game_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "selectedGame" "ExerciseType",
    "score" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMPTZ(3),

    CONSTRAINT "game_session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round" ADD CONSTRAINT "round_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
