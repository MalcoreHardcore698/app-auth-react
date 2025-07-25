// Theme Provider Component
// Провайдер темизации для React приложения

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ThemeContext } from "./context";
import type {
  ThemeConfig,
  ThemeMode,
  PaletteType,
  ThemeProviderProps,
} from "./types";
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEME_ATTRIBUTE,
  PALETTE_ATTRIBUTE,
  SYSTEM_THEME_QUERY,
} from "./constants";
import { loadThemeFromStorage, saveThemeToStorage } from "./storage";

/**
 * Theme Provider Component
 * Провайдер темизации, который управляет состоянием темы
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  // Load initial theme from storage
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    if (typeof window !== "undefined") {
      return loadThemeFromStorage(storageKey);
    }
    return defaultTheme;
  });

  // Track system theme preference
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
    }
    return "light";
  });

  // Calculate resolved theme (actual theme considering system preference)
  const resolvedTheme = useMemo(() => {
    return theme.mode === "system" ? systemTheme : theme.mode;
  }, [theme.mode, systemTheme]);

  const isSystemTheme = theme.mode === "system";

  // Apply theme to DOM
  const applyThemeToDOM = useCallback(
    (config: ThemeConfig, resolved: "light" | "dark") => {
      if (typeof document === "undefined") return;

      const html = document.documentElement;

      // Set theme attribute
      html.setAttribute(THEME_ATTRIBUTE, resolved);

      // Set palette attribute
      html.setAttribute(PALETTE_ATTRIBUTE, config.palette);
    },
    []
  );

  // Set theme mode
  const setTheme = useCallback(
    (mode: ThemeMode) => {
      const newTheme = { ...theme, mode };
      setThemeState(newTheme);
      saveThemeToStorage(newTheme, storageKey);
    },
    [theme, storageKey]
  );

  // Set color palette
  const setPalette = useCallback(
    (palette: PaletteType) => {
      const newTheme = { ...theme, palette };
      setThemeState(newTheme);
      saveThemeToStorage(newTheme, storageKey);
    },
    [theme, storageKey]
  );

  // Toggle between light and dark (ignores system)
  const toggleTheme = useCallback(() => {
    const currentResolved = theme.mode === "system" ? systemTheme : theme.mode;
    const newMode = currentResolved === "light" ? "dark" : "light";
    setTheme(newMode);
  }, [theme.mode, systemTheme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Set initial value
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for changes
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Apply theme to DOM when theme or resolved theme changes
  useEffect(() => {
    applyThemeToDOM(theme, resolvedTheme);
  }, [theme, resolvedTheme, applyThemeToDOM]);

  // Context value
  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      setPalette,
      toggleTheme,
      isSystemTheme,
    }),
    [theme, resolvedTheme, setTheme, setPalette, toggleTheme, isSystemTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
