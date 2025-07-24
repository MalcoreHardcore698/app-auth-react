import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa6";

import { Form, TextField, Button } from "@/shared/ui";
import { useAuth } from "@/services/auth";
import useForm from "@/shared/ui/form/hooks/use-form";
import { DEFAULT_ERROR_MESSAGE } from "@/shared/constants";
import type { IResetPasswordCredentials } from "@/services/auth/types";

import { FORGOT_PASSWORD_VALIDATION_RULES } from "./constants";

import styles from "./styles.module.scss";

function ForgotPasswordForm() {
  const { resetPassword, isLoading } = useAuth();

  const {
    register: registerField,
    trigger,
    formState: { values, errors },
  } = useForm<IResetPasswordCredentials>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    validationRules: FORGOT_PASSWORD_VALIDATION_RULES,
  });

  const emailField = registerField("email");

  const handleSubmit = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    try {
      const response = await resetPassword(values);

      toast.success(response.message);
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

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className={styles.submitButton}
        >
          Reset password
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPasswordForm;
