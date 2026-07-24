/*
  Warnings:

  - Added the required column `imageUrl` to the `shape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shape" ADD COLUMN     "imageUrl" TEXT NOT NULL;
