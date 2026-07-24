import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  dontShowLevel?: boolean;
}

export default async function PageHeader({
  title,
  subtitle,
  icon: Icon,
  children,
  dontShowLevel,
}: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  const { user } = session;
  const necessaryXp = user.level! * (user.level! - 1) * 50;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <span className="text-2xl">{Icon && <Icon />}</span>
          </div>

          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          {children && children}
        </div>

        {!dontShowLevel && (
          <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Livello {user.level}</span>
              <span className="text-muted-foreground">
                {user.totalXp} / {necessaryXp} XP
              </span>
            </div>

            <Progress
              value={Math.min((user.totalXp! / necessaryXp) * 100, 100)}
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
