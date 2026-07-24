"use client";

import { AnimatePresence, motion } from "motion/react";

import GameConfetti from "./confetti";
import GameResultCard from "./game-result-card";
import { useEffect } from "react";

type Props = {
  open: boolean;

  xp: number;

  correctAnswers: number;

  totalQuestions: number;
};

export default function GameResultOverlay({
  open,
  xp,
  correctAnswers,
  totalQuestions,
}: Props) {
  useEffect(() => console.log("Game resutl"), []);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-background/50
          backdrop-blur-md
        "
        >
          <GameConfetti active={open} />

          <GameResultCard
            xp={xp}
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
