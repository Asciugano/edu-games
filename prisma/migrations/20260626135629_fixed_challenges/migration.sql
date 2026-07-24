/*
  Warnings:

  - You are about to drop the column `date` on the `daily_challenge` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "daily_challenge_type_date_key";

-- DropIndex
DROP INDEX "user_daily_challenge_userId_challengeId_key";

-- AlterTable
ALTER TABLE "daily_challenge" DROP COLUMN "date";
