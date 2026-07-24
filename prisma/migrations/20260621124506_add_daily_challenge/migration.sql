-- CreateTable
CREATE TABLE "daily_challenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "rewardXp" INTEGER NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "daily_challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_daily_challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_type_date_key" ON "daily_challenge"("type", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_challenge_userId_challengeId_key" ON "user_daily_challenge"("userId", "challengeId");

-- AddForeignKey
ALTER TABLE "user_daily_challenge" ADD CONSTRAINT "user_daily_challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_challenge" ADD CONSTRAINT "user_daily_challenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "daily_challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
