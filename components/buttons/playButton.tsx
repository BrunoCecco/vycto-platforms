"use client";

import React from "react";
interface ShinyButtonProps {
  children: React.ReactNode;
  color1: string;
  color2: string;
  className?: string;
  style?: React.CSSProperties;
}
const PlayButton = ({ children, ...props }: ShinyButtonProps) => {
  return (
    <button
      className="rounded-lg p-0.5"
      style={{
        backgroundImage: `linear-gradient(45deg, ${props.color2} 10% 50%, ${props.color1})`,
      }}
      {...props}
    >
      <div className="duration-400 group relative rounded-lg  bg-black px-8 py-2 text-white transition-all hover:scale-105  hover:bg-transparent">
        {children}
      </div>
    </button>
  );
};

export default PlayButton;
