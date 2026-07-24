"use client";

import { Trophy } from "lucide-react";
import { motion } from "motion/react";

import XPCounter from "./xp-counter";
import GameResultStats from "./game-resutl-stats";
import GameResultActions from "./game-resutl-actions";

type Props = {
  xp: number;
  correctAnswers: number;
  totalQuestions: number;
};

export default function GameResultCard({
  xp,
  correctAnswers,
  totalQuestions,
}: Props) {
  return (
    <motion.div
      initial={{
        y: 300,
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 18,
      }}
      className="w-full max-w-2xl rounded-3xl border bg-background p-10 shadow-2xl"
    >
      <div className="space-y-8">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.25,
              type: "spring",
            }}
            className="rounded-full bg-primary/10 p-5"
          >
            <Trophy className="size-20 text-primary" />
          </motion.div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">🎉 Complimenti!</h1>

          <p className="text-muted-foreground">Hai completato la sessione.</p>
        </div>

        <div className="text-center">
          <XPCounter xp={xp} />

          <p className="mt-2 text-muted-foreground">Esperienza guadagnata</p>
        </div>

        <GameResultStats correct={correctAnswers} total={totalQuestions} />

        <GameResultActions />
      </div>
    </motion.div>
  );
}
