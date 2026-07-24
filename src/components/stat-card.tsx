import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>

            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/50 p-2 transition-colors group-hover:bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {description && (
          <div className="mt-4 border-t border-border/50 pt-3">
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
