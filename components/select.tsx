"use client";

import React, {
  forwardRef,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
    className?: string;
  }
>(({ children, className, ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className={`block w-full rounded-lg border border-gray-300 bg-transparent p-2 focus:outline-none ${className}`}
  >
    {children}
  </select>
));

export const SelectItem = forwardRef<
  HTMLOptionElement,
  OptionHTMLAttributes<HTMLOptionElement> & {
    children: ReactNode;
    value: string;
  }
>(({ children, value, ...props }, ref) => (
  <option ref={ref} value={value} {...props}>
    {children}
  </option>
));
