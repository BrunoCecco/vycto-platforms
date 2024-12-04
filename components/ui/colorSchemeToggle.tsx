"use client";

import { Button } from "@nextui-org/react";
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
    <Button
      aria-label="toggle light/dark mode"
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      className="group z-50 min-w-0 cursor-pointer rounded-md bg-transparent px-2"
      style={{ backdropFilter: "blur(12px)" }}
    >
      {theme === "light" ? (
        <MoonIcon className="" size={20} />
      ) : (
        <SunIcon className=" group-hover:" size={20} />
      )}
    </Button>
  );
}
