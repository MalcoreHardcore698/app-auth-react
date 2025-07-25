// Types for Theming System
// Типы для системы темизации

export type ThemeMode = "light" | "dark" | "system";

export type PaletteType = "default" | "blue" | "orange" | "green" | "purple";

export interface ThemeConfig {
  mode: ThemeMode;
  palette: PaletteType;
}

export interface ThemeContextValue {
  theme: ThemeConfig;
  resolvedTheme: "light" | "dark"; // Resolved system theme
  setTheme: (mode: ThemeMode) => void;
  setPalette: (palette: PaletteType) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeConfig;
  storageKey?: string;
}
