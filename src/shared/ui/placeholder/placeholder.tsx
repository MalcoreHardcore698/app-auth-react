import React, { useMemo } from "react";
import { FaBoxOpen, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import cn from "classnames";

import { Loader } from "@/shared/ui/loader";

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
  size = "medium",
  variant = "empty",
  title,
  description,
  icon,
  action,
  className,
}: IPlaceholderProps) {
  const rootClassName = cn(
    styles.root,
    styles[`variant__${variant}`],
    styles[`size__${size}`],
    className
  );

  const iconSize = useMemo(() => {
    switch (size) {
      case "small":
        return 24;
      case "medium":
        return 32;
      case "large":
        return 48;
      default:
        return 32;
    }
  }, [size]);

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
          icon: icon || <FaExclamationTriangle size={iconSize} />,
          title: title || "An error occurred",
          description: description || "Please try again",
        };
      case "not-found":
        return {
          icon: icon || <FaSearch size={iconSize} />,
          title: title || "Not found",
          description: description || "The requested resource was not found",
        };
      case "empty":
      default:
        return {
          icon: icon || <FaBoxOpen size={iconSize} />,
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
