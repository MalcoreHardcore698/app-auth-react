// Types for Floating Bar
// Типы для плавающей панели

export type FloatingPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface FloatingBarProps {
  position?: FloatingPosition;
  className?: string;
}
