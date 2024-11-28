import { cn } from "@/lib/utils";
import React from "react";
import LoadingDots from "../icons/loadingDots";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "destructive" | "ghost";
    loading?: 1 | 0;
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variantStyles = {
    default: "bg-stone-800 text-white hover:bg-stone-700 focus:ring-stone-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center space-x-2 rounded-md border p-2 px-4 transition-all focus:outline-none",
        baseStyles,
        variantStyles[variant],
        props.disabled ? "cursor-not-allowed opacity-50" : "",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
      {props.loading == 1 ? <LoadingDots color="#808080" /> : null}
    </button>
  );
});
Button.displayName = "Button";

export default Button;
