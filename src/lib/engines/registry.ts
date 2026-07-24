import { CountObejctGame } from "@/components/games/count-objects/count-objects-game";
import { ImageOrderGame } from "@/components/games/image-order/image-order-game";
import { QuantityComparisonGame } from "@/components/games/quantity-comparison/quantity-comparison-game";
import { SentenceOrderGame } from "@/components/games/sentence-order/sentence-order-game";
import { WordImageMatchGame } from "@/components/games/word-image-match/word-image-match-game";
import { WordOrderGame } from "@/components/games/word-order/word-order-game";

export const gameRegistry = {
  WORD_ORDER: WordOrderGame,
  SENTENCE_ORDER: SentenceOrderGame,
  IMAGE_ORDER: ImageOrderGame,
  COUNT_OBJECTS: CountObejctGame,
  WORD_IMAGE_MATCH: WordImageMatchGame,
  QUANTITY_COMPARISON: QuantityComparisonGame,
};
