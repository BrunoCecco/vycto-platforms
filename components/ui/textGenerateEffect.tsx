"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  delay = 0.1,
  className,
  filter = true,
  duration = 0.5,
  color,
}: {
  words: string;
  delay?: number;
  className?: string;
  filter?: boolean;
  duration?: number;
  color?: string;
}) => {
  const [scope, animate] = useAnimate();
  // Split words by spaces and new lines
  let wordsArray = words.split(/[\n]+/);

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(delay),
      },
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((sentence, idx) => {
          return (
            <div
              key={sentence + idx}
              className="my-1 flex flex-wrap items-center justify-center gap-x-1 text-center text-xs sm:gap-x-2 md:text-lg"
            >
              {sentence.split(" ").map((word, idx) => (
                <motion.span
                  key={word + idx}
                  className={cn("!mb-0 opacity-0", className)}
                  style={{
                    filter: filter ? "blur(10px)" : "none",
                  }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="sm:text-md text-sm leading-none md:text-2xl ">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
