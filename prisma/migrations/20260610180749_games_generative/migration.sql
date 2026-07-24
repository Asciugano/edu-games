/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_exerciseId_fkey";

-- AlterTable
ALTER TABLE "Round" DROP COLUMN "exerciseId",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "Exercise";
