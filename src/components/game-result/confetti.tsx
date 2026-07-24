"use client";

import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

type Props = {
  active: boolean;
};

export default function GameConfetti({ active }: Props) {
  const { width, height } = useWindowSize();

  if (!active) return null;

  return (
    <Confetti
      recycle={false}
      numberOfPieces={350}
      width={width ?? 0}
      height={height ?? 0}
    />
  );
}
