"use client";

import React from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";
interface ShinyButtonProps {
  children: React.ReactNode;
  color1: string;
  color2: string;
  className?: string;
  style?: React.CSSProperties;
}
const PlayButton = ({ children, ...props }: ShinyButtonProps) => {
  return (
    <button {...props}>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="duration-400 group relative bg-black px-8 py-2 text-white transition-all hover:scale-105 hover:bg-transparent"
        color={props.color1}
      >
        {children}
      </HoverBorderGradient>
    </button>
  );
};

export default PlayButton;
