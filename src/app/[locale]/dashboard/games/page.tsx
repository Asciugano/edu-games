import GameModeSelector from "@/components/game-mode-selector";
import PageHeader from "@/components/page-header";
import { Gamepad2 } from "lucide-react";

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <PageHeader
        title="Giochiamo"
        icon={Gamepad2}
        subtitle="Scegli la modalità e inizia a giocare"
      ></PageHeader>
      <GameModeSelector />
    </div>
  );
}
