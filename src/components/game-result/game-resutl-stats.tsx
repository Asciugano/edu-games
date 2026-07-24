import { Card } from "@/components/ui/card";

type Props = {
  correct: number;
  total: number;
};

export default function GameResultStats({ correct, total }: Props) {
  return (
    <Card className="grid grid-cols-2 gap-6 p-5">
      <div className="text-center">
        <p className="text-muted-foreground text-sm">Corrette</p>

        <h2 className="text-4xl font-bold">{correct}</h2>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">Totali</p>

        <h2 className="text-4xl font-bold">{total}</h2>
      </div>
    </Card>
  );
}
