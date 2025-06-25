import { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      className="flex items-center gap-2 px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-accent hover:text-white transition"
      aria-label="Toggle dark mode"
      onClick={() => setDarkMode((v) => !v)}
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
