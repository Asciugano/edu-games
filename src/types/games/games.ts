import {
  Calculator,
  ListOrdered,
  LucideIcon,
  Puzzle,
  Scale,
  Shapes,
  Shuffle,
  TextCursorInput,
} from "lucide-react";
import { ExerciseType } from "../../../generated/prisma/enums";

export type GameResult = {
  isCorrect: boolean;
  answer: string;
};

export type LetterTile = {
  id: string;
  letter: string;
  zone: "answer" | "available";
};

export type WordOrderPayload = {
  word: string;
  image?: string;
  letters: string[];
};

export type SentenceTile = {
  id: string;
  word: string;
  zone: "answer" | "available";
};

export type SentenceOrderPayload = {
  sentence: string;
  words: string[];
};

export type ImageTile = {
  id: string;
  image: string;
  zone: "answer" | "available";
};

export type ImageOrderPayload = {
  order: string[];
  title: string;
  images: string[];
};

export type ObjectCountPayload = {
  name: string;
  image: string;
  number: number;
  numbers: number[];
};

export type WordImageMatchPayload = {
  word: string;
  image?: string;
  words: string[];
};

export type QuantityComparisonPayload = {
  quantity: string;
  answer: string;
  images: string[];
};

export type MathQuizPayload = {
  operandA: number;
  operandB: number;
  operation: string;
  answer: number;
  choices: number[];
};

export const games: {
  id: ExerciseType;
  title: string;
  shortLabel: string;
  desription: string;
  icon: LucideIcon;
}[] = [
  {
    id: ExerciseType.WORD_ORDER,
    title: "Riordina le Parole",
    shortLabel: "Parole",
    desription:
      "Data un immagine e delle lettere sparse crea la parola corretta",
    icon: TextCursorInput,
  },
  {
    id: ExerciseType.SENTENCE_ORDER,
    title: "Frasi Scombussolate",
    shortLabel: "Frasi",
    desription:
      "Data delle parole sparse ricrea la frase giusta (occhio alle parole in piu')",
    icon: Shuffle,
  },
  {
    id: ExerciseType.COUNT_OBJECTS,
    title: "Occhio Geometrico",
    shortLabel: "Conta",
    desription:
      "Data un immagine, una forma e dei numeri, inserire il giusto conteggio delle forme nell'immagine",
    icon: Shapes,
  },
  {
    id: ExerciseType.IMAGE_ORDER,
    title: "In Sequenza",
    shortLabel: "Sequenza",
    desription: "Date tre immagini metterle in ordine cronologico",
    icon: ListOrdered,
  },
  {
    id: ExerciseType.QUANTITY_COMPARISON,
    title: "Tanti Pochi",
    shortLabel: "Quantita'",
    desription:
      "Date due immagini e una domanda selezionare l'immagine che raffigura il numero giusto di soggetti",
    icon: Scale,
  },
  {
    id: ExerciseType.WORD_IMAGE_MATCH,
    title: "Perfect Match",
    shortLabel: "Abbina",
    desription:
      "Data un immagine e diverse parole selezionare la parola giusta",
    icon: Puzzle,
  },
  {
    id: ExerciseType.MATH_QUIZ,
    title: "Quiz Matematico",
    shortLabel: "Matematico",
    desription: "Risolvi i calcoli che ti vengono proposti",
    icon: Calculator,
  },
];
