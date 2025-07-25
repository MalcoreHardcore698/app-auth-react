// usePalette Hook
// Хук для работы с цветовыми палитрами

import { useTheme } from "./use-theme";
import { PALETTE_TYPES, PALETTE_DISPLAY_NAMES } from "../constants";
import type { PaletteType } from "../types";

/**
 * Hook to work with color palettes
 * Хук для работы с цветовыми палитрами
 *
 * @example
 * ```tsx
 * const {
 *   currentPalette,
 *   setPalette,
 *   availablePalettes,
 *   paletteDisplayName
 * } = usePalette();
 *
 * // Change to blue palette
 * setPalette('blue');
 *
 * // Get current palette display name
 * console.log(paletteDisplayName); // "Синяя"
 * ```
 */
export function usePalette() {
  const { theme, setPalette } = useTheme();

  const currentPalette = theme.palette;

  const availablePalettes = PALETTE_TYPES.map((palette) => ({
    value: palette,
    label: PALETTE_DISPLAY_NAMES[palette],
  }));

  const paletteDisplayName = PALETTE_DISPLAY_NAMES[currentPalette];

  const isPaletteActive = (palette: PaletteType) => {
    return currentPalette === palette;
  };

  return {
    currentPalette,
    setPalette,
    availablePalettes,
    paletteDisplayName,
    isPaletteActive,
  };
}
