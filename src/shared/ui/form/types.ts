import type { ReactNode } from "react";

export interface IFormProps<
  Config extends Record<string, unknown> = Record<string, unknown>,
  Values extends TFieldValues = TFieldValues
> {
  config?: Partial<Config>;
  className?: string;
  children?: ReactNode;
  onFinish?: (data: Values) => void;
  onError?: (error: unknown) => void;
  defaultValues?: Partial<Values>;
}

export type TFieldValues = Record<string, unknown>;

export type TValidationRules = {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: unknown) => boolean | string | Promise<boolean | string>;
  custom?: (value: unknown, values: TFieldValues) => boolean | string;
};

export type TFieldError = {
  type?: string;
  message?: string;
};

export type TFormState<T extends TFieldValues = TFieldValues> = {
  values: T;
  errors: Record<keyof T, TFieldError>;
  touchedFields: Record<keyof T, boolean>;
  dirtyFields: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
};

export type TRegisterReturn<T = unknown> = {
  name: string;
  value: string | number | readonly string[] | undefined;
  onChange: <TEvent extends React.ChangeEvent<HTMLInputElement>>(
    event: TEvent
  ) => void;
  onInput: <TEvent extends React.FormEvent<HTMLInputElement>>(
    event: TEvent
  ) => void;
  onPaste: <TEvent extends React.ClipboardEvent<HTMLInputElement>>(
    event: TEvent
  ) => void;
  onAnimationStart: (event: React.AnimationEvent<HTMLInputElement>) => void;
  onTransitionEnd: (event: React.TransitionEvent<HTMLInputElement>) => void;
  onCompositionEnd: (event: React.CompositionEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

export interface IControllerRenderProps<T = unknown> {
  field: {
    value: T;
    onChange: (value: T) => void;
    onBlur: () => void;
    name: string;
  };
  fieldState: {
    error?: TFieldError;
    isDirty: boolean;
    isTouched: boolean;
  };
  formState: {
    errors: Record<string, TFieldError>;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
  };
}

export interface IControllerProps<T extends TFieldValues = TFieldValues> {
  name: keyof T;
  control?: unknown;
  render: (props: IControllerRenderProps<T[keyof T]>) => React.ReactElement;
  rules?: TValidationRules;
  defaultValue?: T[keyof T];
}

export type TFormMethods<T extends TFieldValues = TFieldValues> = {
  register: (
    name: keyof T,
    rules?: TValidationRules
  ) => TRegisterReturn<T[keyof T]>;
  control: {
    setValue: (name: keyof T, value: T[keyof T]) => void;
    getValue: (name: keyof T) => T[keyof T];
    getValues: () => T;
    trigger: (name?: keyof T) => Promise<boolean>;
    clearErrors: (name?: keyof T) => void;
  };
  handleSubmit: (
    onSubmit: (data: T) => void
  ) => (event?: React.FormEvent) => Promise<void>;
  formState: TFormState<T>;
  watch: (name?: keyof T) => T[keyof T] | T;
  reset: (values?: Partial<T>) => void;
  setError: (name: keyof T, error: TFieldError) => void;
  clearErrors: (name?: keyof T) => void;
  setValue: (name: keyof T, value: T[keyof T]) => void;
  trigger: (name?: keyof T) => Promise<boolean>;
};

export interface IUseFormOptions<T extends TFieldValues = TFieldValues> {
  mode?: "onSubmit" | "onBlur" | "onChange";
  defaultValues?: Partial<T>;
  validationRules?: Record<keyof T, TValidationRules>;
  onError?: (error: unknown) => void;
}

export type TUseFormReturn<T extends TFieldValues = TFieldValues> =
  TFormMethods<T>;
