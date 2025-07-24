import { forwardRef, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";

import { TextField, Button, type ITextFieldProps } from "@/shared/ui";

import styles from "./styles.module.scss";

interface IPasswordFieldProps extends ITextFieldProps {
  onForgotPassword?: () => void;
}

const PasswordField = forwardRef<HTMLInputElement, IPasswordFieldProps>(
  ({ onForgotPassword, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const trailing = useMemo(() => {
      const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };

      return (
        <Button
          size="small"
          variant="ghost"
          leading={showPassword ? <FaEyeSlash /> : <FaEye />}
          className={styles.toggleButton}
          onClick={handleTogglePassword}
          clear
        />
      );
    }, [showPassword, setShowPassword]);

    const helperText = useMemo(() => {
      if (!onForgotPassword) return null;

      return (
        <>
          Forgot password?
          <Button
            size="small"
            variant="ghost"
            className={styles.forgotPasswordButton}
            onClick={onForgotPassword}
            clear
          >
            Reset
          </Button>
        </>
      );
    }, [onForgotPassword]);

    return (
      <TextField
        ref={ref}
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        fullWidth
        required
        {...props}
        type={showPassword ? "text" : "password"}
        leading={<FaLock size={14} />}
        trailing={trailing}
        helperText={helperText}
      />
    );
  }
);

export default PasswordField;
