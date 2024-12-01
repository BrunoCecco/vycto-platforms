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
        className="group relative px-8 py-2 transition-all duration-200 hover:scale-105 hover:bg-transparent"
        color={props.color1}
      >
        {children}
      </HoverBorderGradient>
    </div>
  );
};

export default PlayButton;
