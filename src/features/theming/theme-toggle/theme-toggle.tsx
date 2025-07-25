// Theme Toggle Component
// Компонент переключения темы

import React from "react";
import { useTheme } from "@/services/theming";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.scss";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme, isSystemTheme } = useTheme();

  const getIcon = () => {
    if (isSystemTheme) {
      return "🖥️"; // Computer icon for system theme
    }
    return resolvedTheme === "light" ? "🌙" : "☀️";
  };

  const getLabel = () => {
    if (isSystemTheme) {
      return `Системная (${resolvedTheme === "light" ? "светлая" : "темная"})`;
    }
    return resolvedTheme === "light" ? "Темная тема" : "Светлая тема";
  };

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Переключить на ${getLabel()}`}
    >
      <span className={styles.icon} role="img" aria-hidden="true">
        {getIcon()}
      </span>
      <span className={styles.label}>{getLabel()}</span>
    </Button>
  );
}
