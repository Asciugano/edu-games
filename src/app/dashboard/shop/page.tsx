import prisma from "@/lib/prisma";
import { ItemRarity, ShopItemType } from "../../../../generated/prisma/enums";
import { Prisma } from "../../../../generated/prisma/browser";
import { ShopSearchBar } from "@/components/shop/search";
import { ShopItemCard } from "@/components/shop/item-card";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Coins } from "lucide-react";

type ShopPageProps = {
  searchParams: Promise<{
    search?: string;
    type?: ShopItemType;
    max_price?: number;
    min_price?: number;
    rarity?: ItemRarity;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  const { user } = session;

  const { search, type, rarity, max_price, min_price, sort } =
    await searchParams;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };

      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };

      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();

  const where: Prisma.ShopItemWhereInput = {
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(type && { type }),

    ...(rarity && { rarity }),

    ...(min_price || max_price
      ? {
          price: {
            ...(min_price && { gte: min_price }),
            ...(max_price && { lte: max_price }),
          },
        }
      : {}),
  };

  const items = await prisma.shopItem.findMany({ where, orderBy });

  return (
    <div className="space-y-6">
      <PageHeader title="Mercato" subtitle="Acquista quello che ti piace" />
      <div className="flex flex-wrap gap-3">
        <StatCard
          title="Monete"
          value={user.coin ?? 0}
          icon={Coins}
          className="min-w-[180px] flex-1"
        />
      </div>
      <ShopSearchBar />
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {items.map((item) => (
          <ShopItemCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}
