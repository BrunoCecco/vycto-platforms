import React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? "cursor-not-allowed bg-gray-100" : "bg-white"
      } ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;
