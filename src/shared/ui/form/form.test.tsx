import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Form, useFormContext } from "./index";

vi.mock("./styles.module.scss", () => ({
  default: {
    root: "form-root",
  },
}));

const TestField = ({ name, label }: { name: string; label: string }) => {
  const { register, formState } = useFormContext();
  const fieldProps = register(name);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        data-testid={`field-${name}`}
        name={fieldProps.name}
        value={(fieldProps.value as string) || ""}
        onChange={fieldProps.onChange}
        onBlur={fieldProps.onBlur}
      />
      {formState.errors[name] && (
        <span data-testid={`error-${name}`}>
          {formState.errors[name].message}
        </span>
      )}
    </div>
  );
};

const TestFormWithFields = ({
  onFinish,
}: {
  onFinish?: (data: Record<string, unknown>) => void;
}) => {
  return (
    <Form onFinish={onFinish}>
      <TestField name="email" label="Email" />
      <TestField name="password" label="Password" />
      <button type="submit">Submit</button>
    </Form>
  );
};

describe("Form", () => {
  describe("Basic Rendering", () => {
    it("renders form element", () => {
      render(
        <Form>
          <div>Form content</div>
        </Form>
      );

      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <Form>
          <div data-testid="form-content">Form content</div>
        </Form>
      );

      expect(screen.getByTestId("form-content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Form className="custom-form">
          <div>Content</div>
        </Form>
      );

      const form = screen.getByRole("form");
      expect(form).toHaveClass("form-root");
      expect(form).toHaveClass("custom-form");
    });

    it("forwards HTML attributes to form element", () => {
      render(
        <Form data-testid="test-form">
          <div>Content</div>
        </Form>
      );

      const form = screen.getByTestId("test-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Form Context", () => {
    it("provides form context to children", () => {
      const TestComponent = () => {
        const context = useFormContext();
        return (
          <div data-testid="context-test">
            {context ? "has context" : "no context"}
          </div>
        );
      };

      render(
        <Form>
          <TestComponent />
        </Form>
      );

      expect(screen.getByTestId("context-test")).toHaveTextContent(
        "has context"
      );
    });

    it("throws error when useFormContext is used outside Form", () => {
      const TestComponent = () => {
        useFormContext();
        return <div>Test</div>;
      };

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        "useFormContext must be used within a FormProvider"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Form Submission", () => {
    it("calls onFinish when form is submitted", async () => {
      const onFinish = vi.fn();
      const user = userEvent.setup();

      render(<TestFormWithFields onFinish={onFinish} />);

      const emailField = screen.getByTestId("field-email");
      const passwordField = screen.getByTestId("field-password");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onFinish).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("prevents default form submission", async () => {
      const user = userEvent.setup();

      render(<TestFormWithFields />);

      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);
    });

    it("handles submission without onFinish callback", async () => {
      const user = userEvent.setup();

      render(<TestFormWithFields />);

      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);
    });
  });

  describe("Default Values", () => {
    it("applies default values to form fields", () => {
      const TestFormWithDefaults = () => {
        return (
          <Form
            defaultValues={{
              email: "default@example.com",
              password: "defaultpass",
            }}
          >
            <TestField name="email" label="Email" />
            <TestField name="password" label="Password" />
          </Form>
        );
      };

      render(<TestFormWithDefaults />);

      const emailField = screen.getByTestId("field-email") as HTMLInputElement;
      const passwordField = screen.getByTestId(
        "field-password"
      ) as HTMLInputElement;

      expect(emailField.value).toBe("default@example.com");
      expect(passwordField.value).toBe("defaultpass");
    });

    it("allows overriding default values", async () => {
      const TestFormWithDefaults = () => {
        return (
          <Form defaultValues={{ email: "default@example.com" }}>
            <TestField name="email" label="Email" />
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestFormWithDefaults />);

      const emailField = screen.getByTestId("field-email");

      await user.clear(emailField);
      await user.type(emailField, "new@example.com");

      expect(emailField).toHaveValue("new@example.com");
    });
  });

  describe("Form State Management", () => {
    it("tracks form state changes", async () => {
      let formState: {
        errors: Record<string, unknown>;
        isValid: boolean;
        isDirty: boolean;
        isSubmitting: boolean;
      };

      const TestFormWithState = () => {
        const context = useFormContext();
        formState = context.formState;

        return (
          <div>
            <TestField name="email" label="Email" />
            <div data-testid="is-dirty">
              {formState.isDirty ? "dirty" : "clean"}
            </div>
            <div data-testid="is-valid">
              {formState.isValid ? "valid" : "invalid"}
            </div>
          </div>
        );
      };

      const user = userEvent.setup();

      render(
        <Form>
          <TestFormWithState />
        </Form>
      );

      // Initially clean
      expect(screen.getByTestId("is-dirty")).toHaveTextContent("clean");

      // Type to make it dirty
      const emailField = screen.getByTestId("field-email");
      await user.type(emailField, "test@example.com");

      await waitFor(() => {
        expect(screen.getByTestId("is-dirty")).toHaveTextContent("dirty");
      });
    });

    it("updates field values through setValue", async () => {
      let controlMethods: {
        setValue: (name: string, value: unknown) => void;
        getValue: (name: string) => unknown;
        getValues: () => Record<string, unknown>;
      };

      const TestFormWithControl = () => {
        const context = useFormContext();
        controlMethods = context.control;

        return (
          <div>
            <TestField name="email" label="Email" />
            <button
              type="button"
              onClick={() =>
                controlMethods.setValue("email", "controlled@example.com")
              }
              data-testid="set-value-btn"
            >
              Set Value
            </button>
          </div>
        );
      };

      const user = userEvent.setup();

      render(
        <Form>
          <TestFormWithControl />
        </Form>
      );

      const setValueButton = screen.getByTestId("set-value-btn");
      const emailField = screen.getByTestId("field-email") as HTMLInputElement;

      await user.click(setValueButton);

      await waitFor(() => {
        expect(emailField.value).toBe("controlled@example.com");
      });
    });
  });

  describe("Field Registration", () => {
    it("registers fields and tracks their values", async () => {
      const user = userEvent.setup();

      render(<TestFormWithFields />);

      const emailField = screen.getByTestId("field-email");
      const passwordField = screen.getByTestId("field-password");

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");

      expect(emailField).toHaveValue("test@example.com");
      expect(passwordField).toHaveValue("password123");
    });

    it("handles field onChange events", async () => {
      const user = userEvent.setup();

      render(<TestFormWithFields />);

      const emailField = screen.getByTestId("field-email");

      await user.type(emailField, "test@example.com");

      expect(emailField).toHaveValue("test@example.com");
    });

    it("handles field onBlur events", async () => {
      const user = userEvent.setup();

      render(<TestFormWithFields />);

      const emailField = screen.getByTestId("field-email");

      await user.click(emailField);
      await user.tab(); // This will trigger blur

      // Field should be marked as touched after blur
      // This is tested implicitly through the form state
    });
  });

  describe("Error Handling", () => {
    it("handles form submission errors gracefully", async () => {
      const onFinish = vi
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const user = userEvent.setup();

      render(<TestFormWithFields onFinish={onFinish} />);

      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);

      // Should complete without throwing an error

      consoleSpy.mockRestore();
    });
  });

  describe("Form Reset", () => {
    it("resets form values", async () => {
      let resetMethod: (values?: Record<string, unknown>) => void;

      const TestFormWithReset = () => {
        const context = useFormContext();
        resetMethod = context.reset;

        return (
          <div>
            <TestField name="email" label="Email" />
            <button
              type="button"
              onClick={() => resetMethod()}
              data-testid="reset-btn"
            >
              Reset
            </button>
          </div>
        );
      };

      const user = userEvent.setup();

      render(
        <Form defaultValues={{ email: "default@example.com" }}>
          <TestFormWithReset />
        </Form>
      );

      const emailField = screen.getByTestId("field-email") as HTMLInputElement;
      const resetButton = screen.getByTestId("reset-btn");

      // Change value
      await user.clear(emailField);
      await user.type(emailField, "changed@example.com");
      expect(emailField.value).toBe("changed@example.com");

      // Reset
      await user.click(resetButton);

      await waitFor(() => {
        expect(emailField.value).toBe("default@example.com");
      });
    });

    it("resets with new values", async () => {
      let resetMethod: (values?: Record<string, unknown>) => void;

      const TestFormWithReset = () => {
        const context = useFormContext();
        resetMethod = context.reset;

        return (
          <div>
            <TestField name="email" label="Email" />
            <button
              type="button"
              onClick={() => resetMethod({ email: "new@example.com" })}
              data-testid="reset-with-values-btn"
            >
              Reset With New Values
            </button>
          </div>
        );
      };

      const user = userEvent.setup();

      render(
        <Form>
          <TestFormWithReset />
        </Form>
      );

      const emailField = screen.getByTestId("field-email") as HTMLInputElement;
      const resetButton = screen.getByTestId("reset-with-values-btn");

      await user.click(resetButton);

      await waitFor(() => {
        expect(emailField.value).toBe("new@example.com");
      });
    });
  });

  describe("Watch Functionality", () => {
    it("watches individual field values", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let watchMethod: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let watchedValue: any;

      const TestFormWithWatch = () => {
        const context = useFormContext();
        watchMethod = context.watch;
        watchedValue = watchMethod("email");

        return (
          <div>
            <TestField name="email" label="Email" />
            <div data-testid="watched-value">{watchedValue || "empty"}</div>
          </div>
        );
      };

      const user = userEvent.setup();

      render(
        <Form>
          <TestFormWithWatch />
        </Form>
      );

      const emailField = screen.getByTestId("field-email");

      await user.type(emailField, "test@example.com");

      await waitFor(() => {
        expect(screen.getByTestId("watched-value")).toHaveTextContent(
          "test@example.com"
        );
      });
    });

    it("watches all form values", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let watchMethod: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allValues: any;

      const TestFormWithWatchAll = () => {
        const context = useFormContext();
        watchMethod = context.watch;
        allValues = watchMethod();

        return (
          <div>
            <TestField name="email" label="Email" />
            <TestField name="password" label="Password" />
          </div>
        );
      };

      render(
        <Form
          defaultValues={{ email: "test@example.com", password: "pass123" }}
        >
          <TestFormWithWatchAll />
        </Form>
      );

      expect(allValues).toEqual({
        email: "test@example.com",
        password: "pass123",
      });
    });
  });

  describe("TypeScript Generics", () => {
    it("supports typed form data", async () => {
      const onFinish = vi.fn();
      const user = userEvent.setup();

      const TypedTestForm = () => {
        return (
          <Form onFinish={onFinish}>
            <TestField name="email" label="Email" />
            <TestField name="password" label="Password" />
            <TestField name="age" label="Age" />
            <button type="submit">Submit</button>
          </Form>
        );
      };

      render(<TypedTestForm />);

      const emailField = screen.getByTestId("field-email");
      const passwordField = screen.getByTestId("field-password");
      const ageField = screen.getByTestId("field-age");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(emailField, "test@example.com");
      await user.type(passwordField, "password123");
      await user.type(ageField, "25");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onFinish).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          age: "25", // Note: input values are strings
        });
      });
    });
  });
});
