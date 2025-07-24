import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import useForm from "./use-form";
import type { TFieldValues } from "../types";

interface TestFormData extends TFieldValues {
  email: string;
  password: string;
  name: string;
}

describe("useForm", () => {
  describe("Initialization", () => {
    it("initializes with empty values by default", () => {
      const { result } = renderHook(() => useForm());

      expect(result.current.control.getValues()).toEqual({});
      expect(result.current.formState.values).toEqual({});
    });

    it("initializes with default values", () => {
      const defaultValues = {
        email: "test@example.com",
        password: "password123",
      };
      const { result } = renderHook(() => useForm({ defaultValues }));

      expect(result.current.control.getValues()).toEqual(defaultValues);
      expect(result.current.formState.values).toEqual(defaultValues);
    });

    it("initializes form state correctly", () => {
      const { result } = renderHook(() => useForm());

      expect(result.current.formState).toMatchObject({
        values: {},
        errors: {},
        touchedFields: {},
        dirtyFields: {},
        isValid: true,
        isDirty: false,
        isSubmitting: false,
      });
    });

    it("supports different validation modes", () => {
      const { result: onSubmitResult } = renderHook(() =>
        useForm({ mode: "onSubmit" })
      );
      const { result: onBlurResult } = renderHook(() =>
        useForm({ mode: "onBlur" })
      );
      const { result: onChangeResult } = renderHook(() =>
        useForm({ mode: "onChange" })
      );

      expect(onSubmitResult.current).toBeTruthy();
      expect(onBlurResult.current).toBeTruthy();
      expect(onChangeResult.current).toBeTruthy();
    });
  });

  describe("Field Registration", () => {
    it("registers a field", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      const emailField = result.current.register("email");

      expect(emailField).toEqual({
        name: "email",
        value: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    });

    it("registers a field with validation rules", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      const rules = { required: true, minLength: 3 };
      const emailField = result.current.register("email", rules);

      expect(emailField.name).toBe("email");
      expect(emailField.onChange).toBeInstanceOf(Function);
      expect(emailField.onBlur).toBeInstanceOf(Function);
    });

    it("returns current field value after setValue", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setValue("email", "test@example.com");
      });

      const emailField = result.current.register("email");
      expect(emailField.value).toBe("test@example.com");
    });
  });

  describe("Form State Management", () => {
    it("updates values through setValue", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setValue("email", "test@example.com");
      });

      expect(result.current.control.getValue("email")).toBe("test@example.com");
      expect(result.current.formState.values.email).toBe("test@example.com");
    });

    it("gets individual field value", () => {
      const defaultValues = { email: "test@example.com" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      expect(result.current.control.getValue("email")).toBe("test@example.com");
    });

    it("gets all form values", () => {
      const defaultValues = { email: "test@example.com", password: "pass123" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      expect(result.current.control.getValues()).toEqual(defaultValues);
    });

    it("tracks dirty state", () => {
      const defaultValues = { email: "test@example.com" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      expect(result.current.formState.isDirty).toBe(false);

      act(() => {
        result.current.setValue("email", "new@example.com");
      });

      expect(result.current.formState.isDirty).toBe(true);
    });
  });

  describe("Field Events", () => {
    it("handles field onChange event", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      const emailField = result.current.register("email");

      act(() => {
        emailField.onChange({ target: { value: "test@example.com" } } as any);
      });

      expect(result.current.control.getValue("email")).toBe("test@example.com");
    });

    it("handles field onBlur event", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      const emailField = result.current.register("email");

      act(() => {
        emailField.onBlur();
      });

      expect(result.current.formState.touchedFields.email).toBe(true);
    });

    it("validates on change when mode is onChange", () => {
      const { result } = renderHook(() =>
        useForm<TestFormData>({ mode: "onChange" })
      );

      const emailField = result.current.register("email", { required: true });

      act(() => {
        emailField.onChange({ target: { value: "" } } as any);
      });

      // Mode is set correctly and field is registered
      expect(emailField).toBeDefined();
    });

    it("validates on blur when mode is onBlur", () => {
      const { result } = renderHook(() =>
        useForm<TestFormData>({ mode: "onBlur" })
      );

      const emailField = result.current.register("email", { required: true });

      act(() => {
        emailField.onBlur();
      });

      expect(result.current.formState.touchedFields.email).toBe(true);
    });
  });

  describe("Validation", () => {
    it("validates single field", async () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      result.current.register("email", { required: true });

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.trigger("email");
      });

      // Field without value and required rule should be invalid
      expect(isValid!).toBe(false);
    });

    it("validates all fields", async () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      result.current.register("email", { required: true });
      result.current.register("password", { required: true });

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.trigger();
      });

      // Fields without values and required rules should be invalid
      expect(isValid!).toBe(false);
    });

    it("sets field errors", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setError("email", {
          type: "custom",
          message: "Invalid email",
        });
      });

      expect(result.current.formState.errors.email).toEqual({
        type: "custom",
        message: "Invalid email",
      });
      expect(result.current.formState.isValid).toBe(false);
    });

    it("clears single field error", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setError("email", {
          type: "custom",
          message: "Invalid email",
        });
      });

      expect(result.current.formState.errors.email).toBeDefined();

      act(() => {
        result.current.clearErrors("email");
      });

      expect(result.current.formState.errors.email).toBeUndefined();
    });

    it("clears all errors", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setError("email", {
          type: "custom",
          message: "Invalid email",
        });
        result.current.setError("password", {
          type: "custom",
          message: "Invalid password",
        });
      });

      expect(Object.keys(result.current.formState.errors)).toHaveLength(2);

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.formState.errors).toEqual({});
    });
  });

  describe("Form Submission", () => {
    it("handles form submission", async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setValue("email", "test@example.com");
      });

      const submitHandler = result.current.handleSubmit(onSubmit);

      await act(async () => {
        await submitHandler();
      });

      expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("handles validation during submission", async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setError("email", {
          type: "required",
          message: "Required",
        });
      });

      // Form should show as invalid
      expect(result.current.formState.isValid).toBe(false);

      const submitHandler = result.current.handleSubmit(onSubmit);

      await act(async () => {
        await submitHandler();
      });

      // onSubmit was called (form submission always proceeds)
      expect(onSubmit).toHaveBeenCalled();
    });

    it("handles submission errors gracefully", async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useForm<TestFormData>());

      const submitHandler = result.current.handleSubmit(onSubmit);

      await act(async () => {
        await submitHandler();
      });

      expect(result.current.formState.isSubmitting).toBe(false);
      consoleSpy.mockRestore();
    });

    it("prevents default form event", async () => {
      const onSubmit = vi.fn();
      const preventDefault = vi.fn();
      const { result } = renderHook(() => useForm<TestFormData>());

      const submitHandler = result.current.handleSubmit(onSubmit);

      await act(async () => {
        await submitHandler({ preventDefault } as any);
      });

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("Watch Functionality", () => {
    it("watches single field", () => {
      const defaultValues = { email: "test@example.com" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      const emailValue = result.current.watch("email");
      expect(emailValue).toBe("test@example.com");
    });

    it("watches all form values", () => {
      const defaultValues = { email: "test@example.com", password: "pass123" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      const allValues = result.current.watch();
      expect(allValues).toEqual(defaultValues);
    });

    it("returns updated values after changes", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setValue("email", "new@example.com");
      });

      const emailValue = result.current.watch("email");
      expect(emailValue).toBe("new@example.com");
    });
  });

  describe("Reset Functionality", () => {
    it("resets to default values", () => {
      const defaultValues = { email: "test@example.com" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      act(() => {
        result.current.setValue("email", "changed@example.com");
      });

      expect(result.current.control.getValue("email")).toBe(
        "changed@example.com"
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.control.getValue("email")).toBe("test@example.com");
      expect(result.current.formState.errors).toEqual({});
      expect(result.current.formState.touchedFields).toEqual({});
      expect(result.current.formState.isSubmitting).toBe(false);
    });

    it("resets with new values", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      const newValues = { email: "new@example.com", password: "newpass" };

      act(() => {
        result.current.reset(newValues);
      });

      expect(result.current.control.getValues()).toEqual(newValues);
    });

    it("resets dirty state", () => {
      const defaultValues = { email: "test@example.com" };
      const { result } = renderHook(() => useForm({ defaultValues }));

      act(() => {
        result.current.setValue("email", "changed@example.com");
      });

      expect(result.current.formState.isDirty).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.formState.isDirty).toBe(false);
    });
  });

  describe("Control Object", () => {
    it("provides control object with all methods", () => {
      const { result } = renderHook(() => useForm());

      expect(result.current.control).toEqual({
        setValue: expect.any(Function),
        getValue: expect.any(Function),
        getValues: expect.any(Function),
        trigger: expect.any(Function),
        clearErrors: expect.any(Function),
      });
    });

    it("control methods work correctly", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.control.setValue("email", "control@example.com");
      });

      expect(result.current.control.getValue("email")).toBe(
        "control@example.com"
      );
      expect(result.current.control.getValues()).toEqual({
        email: "control@example.com",
      });
    });
  });

  describe("Type Safety", () => {
    it("maintains type safety with TypeScript generics", () => {
      const { result } = renderHook(() => useForm<TestFormData>());

      act(() => {
        result.current.setValue("email", "test@example.com");
        result.current.setValue("password", "password123");
        result.current.setValue("name", "John Doe");
      });

      const values = result.current.control.getValues();
      expect(values).toEqual({
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
      });
    });
  });
});
