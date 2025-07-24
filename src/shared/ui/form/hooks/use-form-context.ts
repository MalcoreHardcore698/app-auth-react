import { useContext } from "react";

import FormContext, { type IFormContextValue } from "../context";
import type { TFieldValues } from "../types";

function useFormContext<
  T extends TFieldValues = TFieldValues
>(): IFormContextValue<T> {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context as IFormContextValue<T>;
}

export default useFormContext;
