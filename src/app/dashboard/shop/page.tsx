import prisma from "@/lib/prisma";
import { ItemRarity, ShopItemType } from "../../../../generated/prisma/enums";
import { Prisma } from "../../../../generated/prisma/browser";
import { ShopSearchBar } from "@/components/shop/search";

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

  return <ShopSearchBar />;
}
