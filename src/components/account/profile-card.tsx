"use client";

import { Flame, Star, Trophy } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  name: string;
  email: string;
  image?: string | null;

  level: number;
  xp: number;
  streak: number;
}

export function ProfileCard({
  name,
  email,
  image,
  level,
  xp,
  streak,
}: ProfileCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <Avatar className="size-24 border-4 border-background shadow-lg">
            <AvatarImage src={image ?? undefined} />

            <AvatarFallback className="text-xl">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div>
              <h3 className="text-2xl font-bold">{name}</h3>

              <p className="text-muted-foreground">{email}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Trophy className="mr-1 size-3" />
                Level {level}
              </Badge>

              <Badge variant="secondary">
                <Star className="mr-1 size-3" />
                {xp} XP
              </Badge>

              <Badge variant="secondary">
                <Flame className="mr-1 size-3" />
                {streak} day streak
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
