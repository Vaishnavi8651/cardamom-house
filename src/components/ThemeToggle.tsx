"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. The actual theme class is applied before paint by the
 * inline script in the layout (so there's no flash); this control just reads the
 * current state on mount and flips it, persisting the choice to localStorage.
 *
 * Renders a neutral placeholder until mounted so SSR and client markup match
 * (the real theme isn't known on the server).
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.classList.toggle("light", next === "light");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures (private mode etc.)
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isDark}
      aria-label={
        theme === null
          ? "Toggle colour theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      className="print-hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/80 text-ink-soft backdrop-blur transition-colors hover:text-brand"
    >
      {theme === null ? (
        <span className="block h-5 w-5" />
      ) : isDark ? (
        // Sun — click to go light
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Moon — click to go dark
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
