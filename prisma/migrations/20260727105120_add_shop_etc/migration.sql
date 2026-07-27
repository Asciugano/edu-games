/*
  Warnings:

  - You are about to drop the column `unlockedAt` on the `achievement` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `achievement` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShopItemType" AS ENUM ('AVATAR', 'FRAME', 'TITLE', 'THEME');

-- CreateEnum
CREATE TYPE "ItemRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- DropForeignKey
ALTER TABLE "achievement" DROP CONSTRAINT "achievement_userId_fkey";

-- AlterTable
ALTER TABLE "achievement" DROP COLUMN "unlockedAt",
DROP COLUMN "userId",
ADD COLUMN     "badgeId" TEXT,
ADD COLUMN     "rewardCoin" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "coin" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "badge" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop-item" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ShopItemType" NOT NULL,
    "rarity" "ItemRarity" NOT NULL DEFAULT 'COMMON',
    "image" TEXT,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop-item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-inventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user-inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-badge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user-badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-achivement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achivementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user-achivement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "badge_key_key" ON "badge"("key");

-- CreateIndex
CREATE UNIQUE INDEX "shop-item_key_key" ON "shop-item"("key");

-- CreateIndex
CREATE UNIQUE INDEX "user-inventory_userId_itemId_key" ON "user-inventory"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "user-badge_userId_badgeId_key" ON "user-badge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user-achivement_userId_achivementId_key" ON "user-achivement"("userId", "achivementId");

-- AddForeignKey
ALTER TABLE "user-inventory" ADD CONSTRAINT "user-inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-inventory" ADD CONSTRAINT "user-inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "shop-item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-badge" ADD CONSTRAINT "user-badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-badge" ADD CONSTRAINT "user-badge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-achivement" ADD CONSTRAINT "user-achivement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-achivement" ADD CONSTRAINT "user-achivement_achivementId_fkey" FOREIGN KEY ("achivementId") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
