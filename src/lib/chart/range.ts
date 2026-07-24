import { DateRange } from "@/types/chars/date-range";

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysAgo(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getRangeConfig(range: DateRange) {
  const now = new Date();

  switch (range) {
    case "1d":
      return {
        start: startOfDay(now),
        unit: "hour",
      };

    case "7d":
      return {
        start: daysAgo(now, 6),
        unit: "day",
      };

    case "30d":
      return {
        start: daysAgo(now, 29),
        unit: "day",
      };

    case "90d":
      return {
        start: daysAgo(now, 89),
        unit: "day",
      };

    case "1y":
      return {
        start: daysAgo(now, 365),
        unit: "month",
      };

    case "3y":
      return {
        start: daysAgo(now, 365 * 3),
        unit: "month",
      };

    case "all":
      return {
        start: null,
        unit: "month",
      };
  }
}

export function buildTimeline(start: Date, unit: "hour" | "day" | "month") {
  const map = new Map<string, number>();
  const now = new Date();

  const current = new Date(start);

  while (current <= now) {
    let key: string;

    if (unit === "hour") {
      key = current.getHours().toString().padStart(2, "0");
      current.setHours(current.getHours() + 1);
    } else if (unit === "day") {
      key = current.toISOString().slice(0, 10);
      current.setDate(current.getDate() + 1);
    } else {
      key = current.toISOString().slice(0, 7); // YYYY-MM
      current.setMonth(current.getMonth() + 1);
    }

    map.set(key, 0);
  }

  return map;
}
