import type { IRegisterCredentials } from "@/services/auth/types";
import type { TValidationRules } from "@/shared/ui/form/types";

export const REGISTER_VALIDATION_RULES: Record<
  keyof IRegisterCredentials,
  TValidationRules
> = {
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters long",
    },
    maxLength: {
      value: 50,
      message: "Name must be less than 50 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Enter a valid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    maxLength: {
      value: 100,
      message: "Password must be less than 100 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message:
        "Password must contain lowercase and uppercase letters, and numbers",
    },
  },
};
