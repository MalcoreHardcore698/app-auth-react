import { toast } from "react-toastify";
import { FaEnvelope, FaUser } from "react-icons/fa6";

import { Form, TextField, Button } from "@/shared/ui";
import { useAuth } from "@/services/auth";
import useForm from "@/shared/ui/form/hooks/use-form";
import { DEFAULT_ERROR_MESSAGE } from "@/shared/constants";
import type { IRegisterCredentials } from "@/services/auth/types";

import { REGISTER_VALIDATION_RULES } from "./constants";
import { PasswordField } from "../password-field";

import styles from "./styles.module.scss";

function RegisterForm() {
  const { error, register, isLoading } = useAuth();

  const {
    register: registerField,
    formState: { values, errors },
    trigger,
  } = useForm<IRegisterCredentials>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validationRules: REGISTER_VALIDATION_RULES,
  });

  const nameField = registerField("name");
  const emailField = registerField("email");
  const passwordField = registerField("password");

  const handleSubmit = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    try {
      await register(values);
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
            {...nameField}
            label="Name"
            type="text"
            error={errors.name?.message}
            leading={<FaUser size={14} />}
            placeholder="Enter your name"
            autoComplete="name"
            autoFocus
            fullWidth
            required
          />
        </div>

        <div className={styles.field}>
          <TextField
            {...emailField}
            label="Email"
            type="email"
            error={errors.email?.message}
            leading={<FaEnvelope size={14} />}
            placeholder="Enter your email"
            autoComplete="email"
            fullWidth
            required
          />
        </div>

        <div className={styles.field}>
          <PasswordField {...passwordField} error={errors.password?.message} />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          className={styles.submitButton}
        >
          Register
        </Button>
      </Form>
    </div>
  );
}

export default RegisterForm;
