import { useState } from "react";
import { FaCog, FaTimes } from "react-icons/fa";

import { ThemeToggle, PaletteSelector } from "@/features/theming";

import type { FloatingBarProps } from "./types";

import styles from "./styles.module.scss";
import { Button } from "@/shared/ui";

export function FloatingBar({
  position = "top-right",
  className,
}: FloatingBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const positionClass = styles[`position-${position}`];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.floatingBar} ${positionClass} ${className || ""}`}
    >
      <Button
        size="small"
        variant="ghost"
        className={styles.toggleButton}
        leading={isExpanded ? <FaTimes /> : <FaCog />}
        onClick={toggleExpanded}
        aria-label={
          isExpanded ? "Свернуть панель настроек" : "Развернуть панель настроек"
        }
        aria-expanded={isExpanded}
        clear
      />

      {/* Выдвижная панель */}
      <div className={`${styles.panel} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Настройки</h3>
        </div>

        <div className={styles.panelContent}>
          {/* Переключатель темы */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Тема</label>
            <ThemeToggle />
          </div>

          {/* Селектор палитры */}
          <div className={styles.section}>
            <PaletteSelector />
          </div>

          {/* Placeholder для будущего селектора языка */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Язык</label>
            <div className={styles.placeholder}>
              <span className={styles.placeholderText}>Скоро появится</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
