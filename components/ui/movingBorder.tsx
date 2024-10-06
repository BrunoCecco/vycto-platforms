"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function MovingBorder({
  color1,
  color2,
  className,
  children,
}: {
  color1: string;
  color2: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    controls.start("hover");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start("animate");
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.svg
        className={`absolute inset-0 h-full w-full ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.rect
          x="0"
          y="0"
          rx="12"
          ry="12"
          width={"100%"}
          height={"100%"}
          stroke="url(#gradient1)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 1, pathOffset: 0 }}
        />
        <motion.rect
          x="0"
          y="0"
          rx="12"
          ry="12"
          width={"100%"}
          height={"100%"}
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={controls}
          variants={{
            animate: {
              pathLength: 0.1,
              pathOffset: [0, 1],
              transition: {
                pathOffset: { duration: 3, repeat: Infinity, ease: "linear" },
                pathLength: { duration: 0.01 },
              },
            },
            hover: {
              pathLength: 1,
              pathOffset: 0,
              transition: { duration: 1, ease: "easeOut" },
            },
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="50%" stopColor={color1} />
            <stop offset="100%" stopColor={color1} />
          </linearGradient>
          {/* <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color2} />
            <stop offset="50%" stopColor={color2} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient> */}
        </defs>
      </motion.svg>
      <div className="relative z-10 h-full w-full p-4 text-center">
        {children}
      </div>
    </div>
  );
}
