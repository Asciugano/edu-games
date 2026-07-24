"use client";

import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  xp: number;
};

export default function XPCounter({ xp }: Props) {
  const value = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(value, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    const controls = animate(value, xp, {
      duration: 1.2,
    });

    return () => controls.stop();
  }, [xp, value]);

  return (
    <span className="text-5xl font-bold text-primary">+{displayValue}</span>
  );
}
