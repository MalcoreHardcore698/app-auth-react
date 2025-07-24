import React from "react";
import cn from "classnames";

import { Loader } from "../loader";

import styles from "./styles.module.scss";

export interface IPlaceholderProps {
  variant?: "loading" | "error" | "empty" | "not-found";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
}

function Placeholder({
  variant = "empty",
  title,
  description,
  icon,
  action,
  size = "medium",
  className,
}: IPlaceholderProps) {
  const rootClassName = cn(
    styles.placeholder,
    styles[`variant__${variant}`],
    styles[`size__${size}`],
    className
  );

  const getDefaultContent = () => {
    switch (variant) {
      case "loading":
        return {
          icon: (
            <Loader
              size={
                size === "small"
                  ? "small"
                  : size === "large"
                  ? "large"
                  : "medium"
              }
            />
          ),
          title: title || "Loading...",
          description: description || "Please wait",
        };
      case "error":
        return {
          icon: icon || "⚠️",
          title: title || "An error occurred",
          description: description || "Please try again",
        };
      case "not-found":
        return {
          icon: icon || "🔍",
          title: title || "Not found",
          description: description || "The requested resource was not found",
        };
      case "empty":
      default:
        return {
          icon: icon || "📭",
          title: title || "No data",
          description: description || "There is nothing here yet",
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className={rootClassName}>
      {content.icon && <div className={styles.icon}>{content.icon}</div>}

      {content.title && <h3 className={styles.title}>{content.title}</h3>}

      {content.description && (
        <p className={styles.description}>{content.description}</p>
      )}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default Placeholder;
