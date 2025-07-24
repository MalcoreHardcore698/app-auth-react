import { type ReactNode, createContext } from "react";

import type {
  TFieldValues,
  TFormMethods,
  TValidationRules,
  TFieldError,
} from "./types";

export interface IFormContextValue<T extends TFieldValues = TFieldValues> {
  register: (
    name: keyof T,
    rules?: TValidationRules
  ) => {
    name: keyof T;
    value: T[keyof T];
    onChange: (value: unknown) => void;
    onBlur: () => void;
  };
  control: {
    setValue: (name: keyof T, value: unknown) => void;
    getValue: (name: keyof T) => unknown;
    getValues: () => T;
    trigger: (name?: keyof T) => Promise<boolean>;
    clearErrors: (name?: keyof T) => void;
  };
  handleSubmit: (
    onSubmit: (data: T) => void
  ) => (event?: React.FormEvent) => Promise<void>;
  formState: {
    errors: Record<keyof T, TFieldError>;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
    touchedFields: Record<keyof T, boolean>;
    dirtyFields: Record<keyof T, boolean>;
  };
  watch: (name?: keyof T) => T[keyof T] | T;
  reset: (values?: Partial<T>) => void;
  setError: (name: keyof T, error: TFieldError) => void;
  clearErrors: (name?: keyof T) => void;
}

const FormContext = createContext<IFormContextValue | null>(null);

export interface FormProviderProps<T extends TFieldValues = TFieldValues> {
  children: ReactNode;
  methods: TFormMethods<T>;
}

export function FormProvider<T extends TFieldValues = TFieldValues>({
  children,
  methods,
}: FormProviderProps<T>) {
  return (
    <FormContext.Provider value={methods as IFormContextValue}>
      {children}
    </FormContext.Provider>
  );
}

export default FormContext;
