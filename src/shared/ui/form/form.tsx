import cn from "classnames";

import { FormProvider } from "./context";
import type { TFieldValues, IFormProps } from "./types";
import useForm from "./hooks/use-form";

import styles from "./styles.module.scss";

function Form<
  Config extends Record<string, unknown> = Record<string, unknown>,
  Values extends TFieldValues = TFieldValues
>({
  className,
  children,
  onFinish,
  onError,
  defaultValues,
  ...props
}: IFormProps<Config, Values>) {
  const rootClassName = cn(styles.root, className);

  const methods = useForm<Values>({
    defaultValues,
    onError,
  });

  const onSubmit = (data: Values) => {
    onFinish?.(data);
  };

  return (
    <FormProvider methods={methods}>
      <form
        role="form"
        className={rootClassName}
        {...props}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;
