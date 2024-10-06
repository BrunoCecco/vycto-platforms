"use client";

import React from "react";
import HoverBorderGradient from "../ui/hoverBorderGradient";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function GradientButton({
  children,
  ...props
}: ShinyButtonProps) {
  return <HoverBorderGradient {...props}>{children}</HoverBorderGradient>;
}
