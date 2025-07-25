// Palette Selector Component
// Компонент выбора цветовой палитры

import React from "react";
import { usePalette } from "@/services/theming";
import type { PaletteType } from "@/services/theming";
import styles from "./styles.module.scss";

interface PaletteOptionProps {
  palette: PaletteType;
  label: string;
  isActive: boolean;
  onSelect: (palette: PaletteType) => void;
}

function PaletteOption({
  palette,
  label,
  isActive,
  onSelect,
}: PaletteOptionProps) {
  const getPreviewColors = (paletteType: PaletteType): string[] => {
    switch (paletteType) {
      case "default":
        return ["#6366f1", "#06b6d4", "#10b981"];
      case "blue":
        return ["#3b82f6", "#0ea5e9", "#06b6d4"];
      case "orange":
        return ["#f97316", "#d97706", "#f59e0b"];
      case "green":
        return ["#22c55e", "#10b981", "#059669"];
      case "purple":
        return ["#a855f7", "#8b5cf6", "#7c3aed"];
      default:
        return ["#6366f1", "#06b6d4", "#10b981"];
    }
  };

  const colors = getPreviewColors(palette);

  return (
    <button
      className={`${styles.paletteOption} ${isActive ? styles.active : ""}`}
      onClick={() => onSelect(palette)}
      aria-label={`Выбрать палитру: ${label}`}
      aria-pressed={isActive}
    >
      <div className={styles.colorPreview}>
        {colors.map((color, index) => (
          <div
            key={index}
            className={styles.colorSwatch}
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className={styles.label}>{label}</span>
      {isActive && (
        <div className={styles.activeIndicator} aria-hidden="true">
          ✓
        </div>
      )}
    </button>
  );
}

export function PaletteSelector() {
  const { availablePalettes, currentPalette, setPalette } = usePalette();

  return (
    <div className={styles.paletteSelector}>
      <h3 className={styles.title}>Цветовая палитра</h3>
      <div className={styles.paletteGrid}>
        {availablePalettes.map(({ value, label }) => (
          <PaletteOption
            key={value}
            palette={value}
            label={label}
            isActive={currentPalette === value}
            onSelect={setPalette}
          />
        ))}
      </div>
    </div>
  );
}
