"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

const animation: Variants = {
  hidden: (direction: -1 | 1) => ({
    y: direction === 1 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: -1 | 1) => ({
    y: direction === 1 ? -30 : 30,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

const Counter = ({
  disabled,
  defaultValue,
  onChange,
}: {
  disabled: boolean;
  defaultValue: number;
  onChange: (value: 1 | -1) => void;
}) => {
  const [num, setNum] = useState(defaultValue || 0);
  const [direction, setDirection] = useState(1);

  const [scope, animate] = useAnimate();

  const handleShake = () => {
    animate(scope.current, { x: [0, 5, -5, 0] }, { duration: 0.2 });
  };

  const counter = (action: "decrease" | "increase") => {
    if (action === "decrease") {
      if (num === 0) return handleShake();
      setNum(num - 1);
      setDirection(-1);
      onChange(-1);
    } else if (action === "increase") {
      if (num === 20) return handleShake();
      setNum(num + 1);
      setDirection(1);
      onChange(1);
    }
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <div
        ref={scope}
        className="flex items-center justify-center gap-2 text-sm sm:text-lg"
      >
        <button
          onClick={() => counter("decrease")}
          disabled={disabled}
          className={cn(
            "bg-box flex h-6 w-6 items-center justify-center rounded-full text-xl active:scale-90 sm:h-20 sm:w-20",
            num === 0 && "opacity-50",
          )}
        >
          <Minus size={32} />
        </button>
        <h3 className="w-4 text-center">
          <AnimatePresence mode="popLayout" custom={direction}>
            {num
              .toString()
              .split("")
              .map((value, index) => (
                <motion.span
                  key={`${value} ${index}`}
                  variants={animation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={direction}
                  className="inline-block text-lg sm:text-2xl"
                >
                  {value}
                </motion.span>
              ))}
          </AnimatePresence>
        </h3>
        <button
          onClick={() => counter("increase")}
          disabled={disabled}
          className={cn(
            "bg-box flex h-6 w-6 items-center justify-center rounded-full text-xl active:scale-90 sm:h-20 sm:w-20",
            num === 20 && "opacity-50",
          )}
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

export default Counter;
