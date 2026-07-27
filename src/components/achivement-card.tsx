import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Achievement } from "../../generated/prisma/client";
import { Trophy, Lock, Coins } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  achivement: Achievement;
  unlockedAt?: Date;
}

export function AchivementCard({ achivement, unlockedAt }: Props) {
  if (!achivement) return null;
  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <CardContent className="flex gap-4 p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl">
          {achivement.image ? (
            <Image
              src={achivement.image}
              alt={achivement.title}
              width={48}
              height={48}
              className="rounded-full "
            />
          ) : unlockedAt ? (
            <Trophy className="h-8 w-8 text-yellow-500" />
          ) : (
            <Lock className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{achivement.title}</h3>

              {achivement.rewardCoin > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Coins className="h-3 w-3" />
                  {achivement.rewardCoin}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {achivement.description}
            </p>
          </div>

          <div className="mt-3">
            {unlockedAt ? (
              <Badge>
                Sbloccato{" "}
                {unlockedAt &&
                  new Intl.DateTimeFormat("it-IT").format(unlockedAt)}
              </Badge>
            ) : (
              <Badge variant="outline">Non ancora sbloccato</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
