// React Context for Theming System
// React Context для системы темизации

import { createContext } from "react";
import type { ThemeContextValue } from "./types";
import { DEFAULT_THEME } from "./constants";

/**
 * Theme Context
 * Контекст для темизации
 */
export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  resolvedTheme: "light",
  setTheme: () => {},
  setPalette: () => {},
  toggleTheme: () => {},
  isSystemTheme: true,
});
