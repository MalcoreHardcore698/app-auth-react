import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa6";

import { Form, TextField, Button } from "@/shared/ui";
import { useAuth } from "@/services/auth";
import useForm from "@/shared/ui/form/hooks/use-form";
import { DEFAULT_ERROR_MESSAGE } from "@/shared/constants";
import type { ILoginCredentials } from "@/services/auth/types";

import { LOGIN_VALIDATION_RULES } from "./constants";
import { PasswordField } from "../password-field";

import styles from "./styles.module.scss";

interface ILoginFormProps {
  onForgotPassword?: () => void;
}

function LoginForm({ onForgotPassword }: ILoginFormProps) {
  const { login, isLoading, error } = useAuth();

  const {
    register: registerField,
    trigger,
    formState: { values, errors },
  } = useForm<ILoginCredentials>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    validationRules: LOGIN_VALIDATION_RULES,
  });

  const emailField = registerField("email");
  const passwordField = registerField("password");

  const handleSubmit = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    try {
      await login(values);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
      );
    }
  };

  return (
    <div className={styles.root}>
      <Form onFinish={handleSubmit}>
        <div className={styles.field}>
          <TextField
            {...emailField}
            label="Email"
            type="email"
            error={errors.email?.message}
            leading={<FaEnvelope size={14} />}
            placeholder="Enter your email"
            autoComplete="email"
            autoFocus
            fullWidth
            required
          />
        </div>

        <div className={styles.field}>
          <PasswordField
            {...passwordField}
            error={errors.password?.message}
            onForgotPassword={onForgotPassword}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className={styles.submitButton}
        >
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
