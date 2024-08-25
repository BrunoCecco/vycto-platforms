import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "destructive" | "ghost";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${props.disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default Button;
