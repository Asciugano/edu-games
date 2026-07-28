import Image from "next/image";
import { Coins } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShopItem } from "../../../generated/prisma/browser";
import { PurchaseButton } from "./purchase-button";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ShopItemCardProps = {
  item: ShopItem;
};

const rarityColors = {
  COMMON: "bg-zinc-500",
  RARE: "bg-blue-500",
  EPIC: "bg-violet-500",
  LEGENDARY: "bg-amber-500",
};

const rarityLabels = {
  COMMON: "Comune",
  RARE: "Rara",
  EPIC: "Epica",
  LEGENDARY: "Leggendaria",
};

export async function ShopItemCard({ item }: ShopItemCardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;
  const { user } = session;

  const ownedItem = await prisma.userInventory.findUnique({
    where: {
      userId_itemId: {
        userId: user.id,
        itemId: item.id,
      },
    },
  });

  const owned = !!ownedItem;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="relative p-0">
        <div className="relative aspect-square bg-muted">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Nessuna immagine
            </div>
          )}

          <Badge
            className={cn("absolute right-3 top-3", rarityColors[item.rarity])}
          >
            {rarityLabels[item.rarity]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/40 p-5">
        <div className="flex items-center gap-2 font-semibold">
          <Coins className="h-5 w-5 text-yellow-500" />

          {item.price}
        </div>

        <PurchaseButton item={item} owned={owned} />
      </CardFooter>
    </Card>
  );
}
