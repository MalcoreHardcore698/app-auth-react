// Constants for Theming System
// Константы для системы темизации

import type { ThemeConfig, ThemeMode, PaletteType } from "./types";

// Default theme configuration
export const DEFAULT_THEME: ThemeConfig = {
  mode: "system",
  palette: "default",
};

// Available theme modes
export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

// Available color palettes
export const PALETTE_TYPES: PaletteType[] = [
  "default",
  "blue",
  "orange",
  "green",
  "purple",
];

// Storage key for localStorage
export const STORAGE_KEY = "app-theme";

// CSS data attributes
export const THEME_ATTRIBUTE = "data-theme";
export const PALETTE_ATTRIBUTE = "data-palette";

// Media query for system theme detection
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

// Palette display names (for UI)
export const PALETTE_DISPLAY_NAMES: Record<PaletteType, string> = {
  default: "Дефолтная",
  blue: "Синяя",
  orange: "Оранжевая",
  green: "Зеленая",
  purple: "Фиолетовая",
};

// Theme mode display names (for UI)
export const THEME_MODE_DISPLAY_NAMES: Record<ThemeMode, string> = {
  light: "Светлая",
  dark: "Темная",
  system: "Системная",
};
