"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function purchaseItem(itemId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autenticato");
  }

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.shopItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      throw new Error("Oggetto non trovato");
    }

    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        coin: true,
      },
    });

    if (!user) {
      throw new Error("Utente non trovato");
    }

    if (user.coin < item.price) {
      throw new Error("Non hai abbastanza monete");
    }

    const owned = await tx.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (owned) {
      throw new Error("Possiedi già questo oggetto");
    }

    const inventory = await tx.userInventory.create({
      data: {
        userId,
        itemId,
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        coin: {
          decrement: item.price,
        },
      },
    });

    return inventory;
  });

  revalidatePath("/dashboard/shop");

  return result;
}
