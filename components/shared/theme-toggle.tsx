"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative rounded-full p-2.5 text-on-surface-variant transition-colors duration-md-short ease-md-standard hover:bg-surface-container-highest"
      aria-label="Toggle theme"
    >
      <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-md-medium ease-md-standard dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 m-auto h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-md-medium ease-md-standard dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
