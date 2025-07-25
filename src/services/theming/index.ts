// Theming Service Exports
// Экспорты сервиса темизации

// Types
export type {
  ThemeMode,
  PaletteType,
  ThemeConfig,
  ThemeContextValue,
  ThemeProviderProps,
} from "./types";

// Constants
export {
  DEFAULT_THEME,
  THEME_MODES,
  PALETTE_TYPES,
  PALETTE_DISPLAY_NAMES,
  THEME_MODE_DISPLAY_NAMES,
  STORAGE_KEY,
  THEME_ATTRIBUTE,
  PALETTE_ATTRIBUTE,
} from "./constants";

// Components
export { ThemeProvider } from "./provider";

// Hooks
export { useTheme } from "./hooks/use-theme";
export { usePalette } from "./hooks/use-palette";

// Storage utilities
export {
  loadThemeFromStorage,
  saveThemeToStorage,
  clearThemeFromStorage,
} from "./storage";
