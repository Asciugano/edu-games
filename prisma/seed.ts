import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ChallengeType } from "../generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  await prisma.word.create({
    data: {
      text: "test",
      imageUrl: "/icon.png",
    },
  });
  await prisma.sentence.create({
    data: {
      sentence: "the test sentence",
    },
  });
  await prisma.image.create({
    data: {
      images: ["/icon.png", "/img1.png", "/next.svg"],
      title: "test",
    },
  });

  await prisma.shape.create({
    data: {
      imageUrl: "/img1.png",
      name: "Triangle",
      number: 3,
    },
  });

  await prisma.quantity.create({
    data: {
      fewWord: "test",
      manyWord: "tests",
      letter: "i",
      fewImage: "/img1.png",
      manyImage: "/icon.png",
    },
  });

  const challenges = [];

  challenges.push(
    await prisma.dailyChallenge.create({
      data: {
        title: "10 risposte corrette",
        description: "Ottieni 10 risposte corrette",
        target: 10,
        rewardXp: 80,
        type: ChallengeType.CORRECT_ANSWERS,
      },
    }),
  );
  challenges.push(
    await prisma.dailyChallenge.create({
      data: {
        title: "10 risposte corrette di fila",
        description: "Ottieni 10 risposte corrette di fila",
        target: 10,
        rewardXp: 100,
        type: ChallengeType.STREAK,
      },
    }),
  );

  await prisma.achievement.create({
    data: {
      key: "first_game",
      title: "Benvenuto",
      description: "Gioca la prima partita",
      rewardCoin: 10,
      type: "GAMES_PLAYED",
      goal: 1,
    },
  });

  await prisma.shopItem.createMany({
    data: [
      {
        name: "Gold Avatar",
        description: "L'avatar piu stiloso di tutti",
        key: "golden_avatar",
        type: "AVATAR",
        rarity: "LEGENDARY",
        price: 100,
      },
      {
        name: "Gold Frame",
        description: "Il frame piu stiloso di tutti",
        key: "golden_frame",
        type: "FRAME",
        rarity: "EPIC",
        price: 50,
      },
      {
        name: "The best",
        description: "Il titolo giusto per i migliori",
        key: "best_title",
        type: "TITLE",
        rarity: "RARE",
        price: 10,
      },
    ],
  });
}
main();
