import { Formatter } from "@/types/chars/formatter";
import { games } from "@/types/games/games";

export function formatValue(value: string, formatter: Formatter = "none") {
  switch (formatter) {
    case "date":
      return new Date(value).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "numeric",
        year: "2-digit",
      });

    case "games":
      return games.find((g) => g.shortLabel === value)?.title;
    default:
      return value;
  }
}
