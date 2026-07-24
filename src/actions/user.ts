"use server";

import { auth } from "@/lib/auth";
import { buildTimeline, daysAgo, getRangeConfig } from "@/lib/chart/range";
import prisma from "@/lib/prisma";
import { DateRange } from "@/types/chars/date-range";
import { headers } from "next/headers";

export async function getUsersChart(range: DateRange) {
  const now = new Date();

  const config = getRangeConfig(range);

  const users = await prisma.user.findMany({
    where: config.start ? { createdAt: { gte: config.start } } : undefined,
    select: { createdAt: true },
  });

  const map = buildTimeline(config.start ?? daysAgo(now, 365), config.unit);

  for (const user of users) {
    let key: string;

    if (config.unit === "hour") {
      key = user.createdAt.getHours().toString().padStart(2, "0");
    } else if (config.unit === "day") {
      key = user.createdAt.toISOString().slice(0, 10);
    } else {
      key = user.createdAt.toISOString().slice(0, 7);
    }

    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([date, users]) => ({
    date,
    users,
  }));
}

export async function updateLastActivity(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActivityAt: true },
  });

  if (!user) return;

  if (
    !user.lastActivityAt ||
    Date.now() - user.lastActivityAt.getTime() > 5 * 60 * 1000
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }
}
