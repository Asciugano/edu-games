/*
  Warnings:

  - Changed the type of `type` on the `daily_challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('CORRECT_ANSWERS', 'GAMES_PLAYED', 'STREAK');

-- AlterTable
ALTER TABLE "daily_challenge" DROP COLUMN "type",
ADD COLUMN     "type" "ChallengeType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_type_date_key" ON "daily_challenge"("type", "date");
