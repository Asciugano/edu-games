import { Card, CardContent } from "@/components/ui/card";

type Props = {
  mode: {
    title: string;
    description: string;
    icon: React.ElementType;
  };
  selected: boolean;
  onClick: () => void;
};

export function GameModeCard({ mode, selected, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer rounded-2xl transition-all hover:shadow-md ${
        selected ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-xl bg-secondary p-3">
          <mode.icon className="size-6" />
        </div>

        <div>
          <h2 className="font-semibold">{mode.title}</h2>
          <p className="text-sm text-muted-foreground">{mode.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
