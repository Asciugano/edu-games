import prisma from "@/lib/prisma";
import { gameRegistry } from "./registry";
import { ExerciseType } from "../../../generated/prisma/enums";

export type GeneratedGame = {
  type: keyof typeof gameRegistry;
  payload: any;
};

function shuffle(arr: string[]) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

export async function generateWordOrder(): Promise<GeneratedGame> {
  const words = await prisma.word.findMany();

  if (!words.length) throw new Error("No words in DB");

  const word = words[Math.floor(Math.random() * words.length)];

  return {
    type: "WORD_ORDER" as keyof typeof gameRegistry,
    payload: {
      word: word.text,
      image: word.imageUrl,
      letters: shuffle(word.text.split("")),
    },
  };
}

export async function generateSentenceOrder(): Promise<GeneratedGame> {
  const sentences = await prisma.sentence.findMany();
  if (!sentences.length) throw new Error("No sentences in DB");

  const sentence = sentences[Math.floor(Math.random() * sentences.length)];

  const sentenceWords = sentence.sentence.trim().split(/\s+/).filter(Boolean);

  const words = await prisma.word.findMany();

  const distractors = words
    .filter((w) => !sentenceWords.includes(w.text))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((w) => w.text);

  const finalWords = [...sentenceWords, ...distractors];

  return {
    type: "SENTENCE_ORDER" as keyof typeof gameRegistry,
    payload: {
      sentence: sentence.sentence,
      words: shuffle(finalWords),
    },
  };
}

export async function generateImageOrder(): Promise<GeneratedGame> {
  const images = await prisma.image.findMany();
  if (!images.length) throw new Error("No image in DB");
  const image = images[Math.floor(Math.random() * images.length)];

  return {
    type: "IMAGE_ORDER" as keyof typeof gameRegistry,
    payload: {
      order: image.images,
      title: image.title,
      images: shuffle(image.images),
    },
  };
}

export async function generateCountObject(): Promise<GeneratedGame> {
  const shapes = await prisma.shape.findMany();

  if (!shapes.length) throw new Error("No image in DB");
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const numbers = [];
  const multiplier = shape.number < 2 ? 4 : shape.number >= 4 ? 1 : 2;
  for (let i = 1; i <= shape.number * multiplier; i++) {
    if (i !== shape.number) numbers.push(i);
  }
  numbers.push(shape.number);

  return {
    type: "COUNT_OBJECTS" as keyof typeof gameRegistry,
    payload: {
      number: shape.number,
      name: shape.name,
      numbers,
      image: shape.imageUrl,
    },
  };
}

export async function generateWordImageMatch(): Promise<GeneratedGame> {
  const words = await prisma.word.findMany();
  if (!words.length) throw new Error("No words in DB");

  const word = words[Math.floor(Math.random() * words.length)];

  const distractors = words
    .filter((w) => !word.text.includes(w.text))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((w) => w.text);

  const finalWords = [word.text, ...distractors];

  return {
    type: "WORD_IMAGE_MATCH" as keyof typeof gameRegistry,
    payload: {
      word: word.text,
      image: word.imageUrl,
      words: shuffle(finalWords),
    },
  };
}

export async function generateQuantityComparison(): Promise<GeneratedGame> {
  const quantities = await prisma.quantity.findMany();
  if (!quantities.length) throw new Error("No quantities in DB");

  const quantity = quantities[Math.floor(Math.random() * quantities.length)];

  const many = Math.random() >= 0.5;
  return {
    type: "QUANTITY_COMPARISON" as keyof typeof gameRegistry,
    payload: {
      quantity: many
        ? `tant${quantity.letter} ${quantity.manyWord}`
        : `poch${quantity.letter} ${quantity.fewWord}`,
      answer: many ? quantity.manyImage : quantity.fewImage,
      images: shuffle([quantity.fewImage, quantity.manyImage]),
    },
  };
}

export const gameGenerators: Record<
  ExerciseType,
  () => Promise<GeneratedGame>
> = {
  WORD_ORDER: generateWordOrder,
  SENTENCE_ORDER: generateSentenceOrder,
  IMAGE_ORDER: generateImageOrder,
  COUNT_OBJECTS: generateCountObject,
  QUANTITY_COMPARISON: generateQuantityComparison,
  WORD_IMAGE_MATCH: generateWordImageMatch,
};
