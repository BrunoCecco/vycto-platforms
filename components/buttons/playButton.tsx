"use client";

import React from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";
interface ShinyButtonProps {
  children: React.ReactNode;
  color1: string;
  color2: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
const PlayButton = ({ children, ...props }: ShinyButtonProps) => {
  return (
    <div {...props}>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="group relative px-4 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-transparent sm:px-8 sm:py-2 sm:text-sm"
        color={props.color1}
      >
        {children}
      </HoverBorderGradient>
    </div>
  );
};

export default PlayButton;
