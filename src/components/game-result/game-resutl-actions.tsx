import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function GameResultActions() {
  return (
    <div className="flex justify-center gap-4">
      <Button size="lg" asChild>
        <Link href="/dashboard/games">Gioca ancora</Link>
      </Button>

      <Button size="lg" variant="outline" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
