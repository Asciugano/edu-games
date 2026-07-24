import { Shuffle, Trophy } from "lucide-react";
import { GameMode } from "../../../generated/prisma/enums";

export const gameModes = [
  {
    id: GameMode.MIXED,
    title: "Mixed",
    icon: Shuffle,
    description: "gioca a dei giochi casuali",
  },
  {
    id: GameMode.SINGLE,
    title: "Single",
    icon: Trophy,
    description: "gioca sempre allo stesso gioco",
  },
];
