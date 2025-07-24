import type { ILoginCredentials } from "@/services/auth/types";
import type { TValidationRules } from "@/shared/ui/form/types";

export const FORGOT_PASSWORD_VALIDATION_RULES: Record<
  keyof ILoginCredentials,
  TValidationRules
> = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Enter a valid email address",
    },
  },
};
