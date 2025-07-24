import React, { forwardRef } from "react";
import cn from "classnames";
import { Loader } from "../loader";

import styles from "./styles.module.scss";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  clear?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      size = "medium",
      variant = "primary",
      loading = false,
      fullWidth = false,
      leading,
      trailing,
      children,
      className,
      disabled,
      clear = false,
      type = "button",
      title,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClassName = cn(
      styles.root,
      styles[`variant__${variant}`],
      styles[`size__${size}`],
      {
        [styles.state__loading]: loading,
        [styles.state__disabled]: isDisabled,
        [styles.fullWidth]: fullWidth,
        [styles.clear]: clear,
      },
      className
    );

    const buttonTitle =
      title ||
      (typeof children === "string" ? (children as string) : undefined);

    const buttonAriaLabel =
      ariaLabel ||
      (typeof children === "string" ? (children as string) : undefined);

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={isDisabled}
        type={type}
        title={buttonTitle}
        aria-label={buttonAriaLabel}
        aria-describedby={ariaDescribedby}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <Loader
              size={
                size === "small"
                  ? "small"
                  : size === "large"
                  ? "medium"
                  : "small"
              }
              color="white"
            />
          </span>
        )}

        {leading && !loading && (
          <span className={styles.icon} aria-hidden="true">
            {leading}
          </span>
        )}

        {children && <span className={styles.content}>{children}</span>}

        {trailing && !loading && (
          <span className={styles.icon} aria-hidden="true">
            {trailing}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
