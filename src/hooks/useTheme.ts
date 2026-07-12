import { useCallback, useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "theme";

type ThemeListener = () => void;

const themeListeners = new Set<ThemeListener>();

/**
 * Read the initial theme from localStorage or system preference.
 */
function getInitialIsDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark") {
    return true;
  }
  if (storedTheme === "light") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readIsDarkFromDocument(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains("dark");
}

function applyThemeToDocument(isDark: boolean): void {
  const root = document.documentElement;

  if (isDark) {
    root.classList.add("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
  }
}

function subscribeToTheme(listener: ThemeListener): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function notifyThemeListeners(): void {
  themeListeners.forEach((listener) => {
    listener();
  });
}

function getThemeSnapshot(): boolean {
  return readIsDarkFromDocument();
}

function getThemeServerSnapshot(): boolean {
  return false;
}

export interface UseThemeResult {
  isDark: boolean;
  toggleTheme: () => void;
}

/**
 * Shared light/dark theme state — toggles `dark` on documentElement and persists to localStorage.
 * Safe to call from multiple components; state stays synchronized.
 */
export function useTheme(): UseThemeResult {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const toggleTheme = useCallback((): void => {
    const nextIsDark = !readIsDarkFromDocument();
    applyThemeToDocument(nextIsDark);
    notifyThemeListeners();
  }, []);

  return { isDark, toggleTheme };
}

/**
 * Ensure document theme matches stored preference on first import (client only).
 */
if (typeof window !== "undefined") {
  applyThemeToDocument(getInitialIsDark());
}
