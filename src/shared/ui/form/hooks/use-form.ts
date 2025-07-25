import { useCallback, useRef, useState } from "react";

import type {
  IUseFormOptions,
  TFieldError,
  TFieldValues,
  TFormState,
  TRegisterReturn,
  TUseFormReturn,
  TValidationRules,
} from "../types";
import {
  getDirtyFields,
  validateField,
  validateForm,
} from "../utils/validation";

function useForm<T extends TFieldValues = TFieldValues>(
  options: IUseFormOptions<T> = {}
): TUseFormReturn<T> {
  const {
    mode = "onSubmit",
    defaultValues = {} as Partial<T>,
    validationRules: initialValidationRules = {} as Record<
      keyof T,
      TValidationRules
    >,
    onError,
  } = options;

  const [values, setValues] = useState<T>({ ...defaultValues } as T);
  const [errors, setErrors] = useState<Record<keyof T, TFieldError>>(
    {} as Record<keyof T, TFieldError>
  );
  const [touchedFields, setTouchedFields] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules = useRef<Record<keyof T, TValidationRules>>({
    ...initialValidationRules,
  } as Record<keyof T, TValidationRules>);
  const initialValues = useRef<T>({ ...defaultValues } as T);

  const dirtyFields = getDirtyFields<T>(values, initialValues.current);
  const isDirty = Object.values(dirtyFields).some(Boolean);
  const isValid = Object.keys(errors).length === 0;

  const formState: TFormState<T> = {
    values,
    errors,
    touchedFields,
    dirtyFields,
    isValid,
    isDirty,
    isSubmitting,
  };

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getValue = useCallback(
    (name: keyof T): T[keyof T] => {
      return values[name];
    },
    [values]
  );

  const getValues = useCallback((): T => {
    return values;
  }, [values]);

  const trigger = useCallback(
    async (name?: keyof T): Promise<boolean> => {
      if (name) {
        const rules = validationRules.current[name];

        if (rules) {
          const error = await validateField(values[name], rules, values);

          setErrors((prev) => {
            const newErrors = { ...prev };
            if (error) {
              newErrors[name] = error;
            } else {
              delete newErrors[name];
            }
            return newErrors;
          });

          return !error;
        }

        return true;
      } else {
        const newErrors = await validateForm(values, validationRules.current);

        setErrors(newErrors as Record<keyof T, TFieldError>);

        return Object.keys(newErrors).length === 0;
      }
    },
    [values]
  );

  const validateAndUpdateErrors = useCallback(
    async (name: keyof T, value: T[keyof T]) => {
      const rules = validationRules.current[name];

      if (rules) {
        const allValues = { ...values, [name]: value } as T;
        const error = await validateField(value, rules, allValues);

        setErrors((prev) => {
          const newErrors = { ...prev };

          if (error) {
            newErrors[name] = error;
          } else {
            delete newErrors[name];
          }

          return newErrors;
        });

        return !error;
      }

      return true;
    },
    [values]
  );

  const register = useCallback(
    (name: keyof T, rules?: TValidationRules): TRegisterReturn => {
      if (rules) {
        validationRules.current[name] = rules;
      }

      return {
        name: name as string,
        value: (values[name] as string) || "",
        onChange: <TEvent extends React.ChangeEvent<HTMLInputElement>>(
          event: TEvent
        ) => {
          const newValue = event?.target ? event.target.value : event;

          setValue(name, newValue as T[keyof T]);

          if (mode === "onChange") {
            validateAndUpdateErrors(name, newValue as T[keyof T]);
          }
        },
        onInput: <TEvent extends React.FormEvent<HTMLInputElement>>(
          event: TEvent
        ) => {
          const newValue = (event.target as HTMLInputElement).value;

          setValue(name, newValue as T[keyof T]);

          if (mode === "onChange") {
            validateAndUpdateErrors(name, newValue as T[keyof T]);
          }
        },
        onPaste: <TEvent extends React.ClipboardEvent<HTMLInputElement>>(
          event: TEvent
        ) => {
          setTimeout(() => {
            const newValue = (event.target as HTMLInputElement).value;
            setValue(name, newValue as T[keyof T]);

            if (mode === "onChange") {
              validateAndUpdateErrors(name, newValue as T[keyof T]);
            }
          }, 100);
        },
        onAnimationStart: (event: React.AnimationEvent<HTMLInputElement>) => {
          if (event.animationName === "onAutoFillStart") {
            const newValue = (event.target as HTMLInputElement).value;

            setValue(name, newValue as T[keyof T]);

            if (mode === "onChange") {
              validateAndUpdateErrors(name, newValue as T[keyof T]);
            }
          }
        },
        onTransitionEnd: (event: React.TransitionEvent<HTMLInputElement>) => {
          const newValue = (event.target as HTMLInputElement).value;

          if (newValue && newValue !== values[name]) {
            setValue(name, newValue as T[keyof T]);

            if (mode === "onChange") {
              validateAndUpdateErrors(name, newValue as T[keyof T]);
            }
          }
        },
        onCompositionEnd: (event: React.CompositionEvent<HTMLInputElement>) => {
          const newValue = (event.target as HTMLInputElement).value;

          setValue(name, newValue as T[keyof T]);

          if (mode === "onChange") {
            validateAndUpdateErrors(name, newValue as T[keyof T]);
          }
        },
        onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
          setTimeout(() => {
            const newValue = (event.target as HTMLInputElement).value;
            if (newValue && newValue !== values[name]) {
              setValue(name, newValue as T[keyof T]);

              if (mode === "onChange") {
                validateAndUpdateErrors(name, newValue as T[keyof T]);
              }
            }
          }, 100);
        },
        onBlur: () => {
          setTouchedFields((prev) => ({ ...prev, [name]: true }));

          if (mode === "onBlur") {
            trigger(name);
          }
        },
      };
    },
    [values, setValue, trigger, mode, validateAndUpdateErrors]
  );

  const clearErrors = useCallback((name?: keyof T) => {
    if (name) {
      setErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[name];

        return newErrors;
      });
    } else {
      setErrors({} as Record<keyof T, TFieldError>);
    }
  }, []);

  const setError = useCallback((name: keyof T, error: TFieldError) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleSubmit = useCallback(
    (onSubmit: (data: T) => void) => {
      return async (event?: React.FormEvent) => {
        if (event) {
          event.preventDefault();
        }

        setIsSubmitting(true);

        try {
          const isFormValid = await trigger();

          if (isFormValid) {
            await onSubmit(values);
          }
        } catch (error) {
          onError?.(error);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, trigger, setIsSubmitting, onError]
  );

  const watch = useCallback(
    (name?: keyof T): T[keyof T] | T => {
      return name ? values[name] : values;
    },
    [values]
  );

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues
        ? { ...defaultValues, ...newValues }
        : defaultValues;

      setValues(resetValues as T);
      setErrors({} as Record<keyof T, TFieldError>);
      setTouchedFields({} as Record<keyof T, boolean>);
      setIsSubmitting(false);

      initialValues.current = resetValues as T;
    },
    [defaultValues]
  );

  const control = {
    setValue,
    getValue,
    getValues,
    trigger,
    clearErrors,
  };

  return {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
    trigger,
  };
}

export default useForm;
