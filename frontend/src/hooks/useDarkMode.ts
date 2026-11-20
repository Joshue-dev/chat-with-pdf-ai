import { useState, useEffect } from "react";

function getInitialTheme(): boolean {
  const saved = localStorage.getItem("theme");
  if (saved !== null) {
    return saved === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return [isDark, toggleTheme];
}