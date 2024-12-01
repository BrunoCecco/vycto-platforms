"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ColorSchemeToggle() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    if (currentTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [currentTheme]);

  return (
    <button
      aria-label="toggle light/dark mode"
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      className="group flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-200"
    >
      {theme === "light" ? (
        <MoonIcon className="text-black" size={20} />
      ) : (
        <SunIcon className="text-white group-hover:text-black" />
      )}
    </button>
  );
}
