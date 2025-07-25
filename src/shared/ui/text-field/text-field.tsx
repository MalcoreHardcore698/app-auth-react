import React, { useId } from "react";
import cn from "classnames";

import { Loader } from "@/shared/ui/loader";

import styles from "./styles.module.scss";

export interface ITextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "small" | "medium" | "large";
  label?: string;
  error?: string;
  variant?: "outlined" | "filled";
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  required?: boolean;
}

function TextField({
  id,
  ref,
  size = "medium",
  type = "text",
  label,
  error,
  leading,
  trailing,
  className,
  helperText,
  variant = "outlined",
  loading = false,
  required = false,
  fullWidth = false,
  disabled,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  ...props
}: ITextFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  const generatedId = useId();

  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);
  const isDisabled = disabled || loading;

  const rootClassName = cn(
    styles.root,
    {
      [styles.fullWidth]: fullWidth,
      [styles.hasError]: hasError,
      [styles.isDisabled]: isDisabled,
      [styles.isRequired]: required,
    },
    className
  );

  const inputWrapperClassName = cn(
    styles.inputWrapper,
    styles[`variant__${variant}`],
    styles[`size__${size}`],
    {
      [styles.hasLeftIcon]: leading,
      [styles.hasRightIcon]: trailing || loading,
      [styles.state__error]: hasError,
      [styles.state__disabled]: isDisabled,
      [styles.fullWidth]: fullWidth,
    }
  );

  const describedBy =
    [ariaDescribedby, helperText && helperId, error && errorId]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={rootClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span
              className={styles.requiredIndicator}
              aria-label="required field"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={inputWrapperClassName}>
        {leading && (
          <div className={styles.leading} aria-hidden="true">
            {leading}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={isDisabled}
          className={styles.input}
          aria-invalid={ariaInvalid || hasError}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />

        {loading && (
          <span className={styles.loading} aria-hidden="true">
            <Loader />
          </span>
        )}

        {trailing && !loading && (
          <div className={styles.trailing}>{trailing}</div>
        )}
      </div>

      {(helperText || error) && (
        <div className={styles.helperText}>
          {error && (
            <span
              id={errorId}
              className={styles.error}
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}

          {helperText && !error && (
            <span id={helperId} className={styles.helper}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default TextField;
