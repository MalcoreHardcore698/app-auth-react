// Storage utilities for theme persistence
// Утилиты для сохранения настроек темы в localStorage

import type { ThemeConfig } from "./types";
import { DEFAULT_THEME, STORAGE_KEY } from "./constants";

/**
 * Load theme configuration from localStorage
 * Загружает конфигурацию темы из localStorage
 */
export function loadThemeFromStorage(
  storageKey: string = STORAGE_KEY
): ThemeConfig {
  try {
    if (typeof window === "undefined") {
      return DEFAULT_THEME;
    }

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return DEFAULT_THEME;
    }

    const parsed = JSON.parse(stored);

    // Validate the stored data
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.mode === "string" &&
      typeof parsed.palette === "string"
    ) {
      return {
        mode: parsed.mode,
        palette: parsed.palette,
      };
    }

    return DEFAULT_THEME;
  } catch (error) {
    console.warn("Failed to load theme from storage:", error);
    return DEFAULT_THEME;
  }
}

/**
 * Save theme configuration to localStorage
 * Сохраняет конфигурацию темы в localStorage
 */
export function saveThemeToStorage(
  theme: ThemeConfig,
  storageKey: string = STORAGE_KEY
): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(theme));
  } catch (error) {
    console.warn("Failed to save theme to storage:", error);
  }
}

/**
 * Clear theme configuration from localStorage
 * Очищает конфигурацию темы из localStorage
 */
export function clearThemeFromStorage(storageKey: string = STORAGE_KEY): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn("Failed to clear theme from storage:", error);
  }
}
