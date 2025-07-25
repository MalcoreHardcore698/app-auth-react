// useTheme Hook
// Основной хук для работы с темизацией

import { useContext } from "react";
import { ThemeContext } from "../context";

/**
 * Hook to access and control theme
 * Хук для доступа и управления темой
 *
 * @example
 * ```tsx
 * const { theme, setTheme, setPalette, toggleTheme } = useTheme();
 *
 * // Change theme mode
 * setTheme('dark');
 *
 * // Change color palette
 * setPalette('blue');
 *
 * // Toggle between light and dark
 * toggleTheme();
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
