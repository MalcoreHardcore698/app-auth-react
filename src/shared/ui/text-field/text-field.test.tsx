import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextField } from "./index";
import type { ITextFieldProps } from "./text-field";

vi.mock("./styles.module.scss", () => ({
  default: {
    root: "textfield-root",
    label: "textfield-label",
    requiredIndicator: "textfield-required-indicator",
    inputWrapper: "textfield-input-wrapper",
    input: "textfield-input",
    leftIcon: "textfield-left-icon",
    rightIcon: "textfield-right-icon",
    spinner: "textfield-spinner",
    helperText: "textfield-helper-text",
    error: "textfield-error",
    helper: "textfield-helper",
    variant__outlined: "textfield-variant-outlined",
    variant__filled: "textfield-variant-filled",
    size__small: "textfield-size-small",
    size__medium: "textfield-size-medium",
    size__large: "textfield-size-large",
    hasError: "textfield-has-error",
    isDisabled: "textfield-is-disabled",
    isRequired: "textfield-is-required",
    fullWidth: "textfield-full-width",
    hasLeftIcon: "textfield-has-left-icon",
    hasRightIcon: "textfield-has-right-icon",
    state__error: "textfield-state-error",
    state__disabled: "textfield-state-disabled",
  },
}));

describe("TextField", () => {
  describe("Basic Rendering", () => {
    it("renders input element", () => {
      render(<TextField />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      render(<TextField placeholder="Enter text here" />);
      expect(
        screen.getByPlaceholderText("Enter text here")
      ).toBeInTheDocument();
    });

    it("renders with default value", () => {
      render(<TextField defaultValue="Default text" />);
      expect(screen.getByDisplayValue("Default text")).toBeInTheDocument();
    });

    it("renders with controlled value", () => {
      render(<TextField value="Controlled text" onChange={() => {}} />);
      expect(screen.getByDisplayValue("Controlled text")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<TextField className="custom-textfield" />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      expect(container).toHaveClass("custom-textfield");
    });
  });

  describe("Label", () => {
    it("renders label when provided", () => {
      render(<TextField label="Email Address" />);
      expect(screen.getByText("Email Address")).toBeInTheDocument();
    });

    it("associates label with input", () => {
      render(<TextField label="Email Address" id="email-input" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email Address");

      expect(label).toHaveAttribute("for", "email-input");
      expect(input).toHaveAttribute("id", "email-input");
    });

    it("generates id automatically when not provided", () => {
      render(<TextField label="Email Address" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email Address");

      const inputId = input.getAttribute("id");
      expect(inputId).toBeTruthy();
      expect(label).toHaveAttribute("for", inputId);
    });

    it("renders without label", () => {
      render(<TextField />);
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
    });
  });

  describe("Required Field", () => {
    it("shows required indicator when required=true", () => {
      render(<TextField label="Email" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("applies required aria attribute", () => {
      render(<TextField required />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-required",
        "true"
      );
    });

    it("applies required CSS class", () => {
      render(<TextField required />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      expect(container).toHaveClass("textfield-is-required");
    });

    it("does not show required indicator by default", () => {
      render(<TextField label="Email" />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    const variants: Array<ITextFieldProps["variant"]> = ["outlined", "filled"];

    it.each(variants)("applies correct class for %s variant", (variant) => {
      render(<TextField variant={variant} />);
      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass(`textfield-variant-${variant}`);
    });

    it("uses outlined as default variant", () => {
      render(<TextField />);
      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass("textfield-variant-outlined");
    });
  });

  describe("Sizes", () => {
    const sizes: Array<ITextFieldProps["size"]> = ["small", "medium", "large"];

    it.each(sizes)("applies correct class for %s size", (size) => {
      render(<TextField size={size} />);
      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass(`textfield-size-${size}`);
    });

    it("uses medium as default size", () => {
      render(<TextField />);
      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass("textfield-size-medium");
    });
  });

  describe("Full Width", () => {
    it("applies fullWidth class when fullWidth=true", () => {
      render(<TextField fullWidth />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      const inputWrapper = screen.getByRole("textbox").parentElement;

      expect(container).toHaveClass("textfield-full-width");
      expect(inputWrapper).toHaveClass("textfield-full-width");
    });

    it("does not apply fullWidth class by default", () => {
      render(<TextField />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      expect(container).not.toHaveClass("textfield-full-width");
    });
  });

  describe("Error State", () => {
    it("displays error message", () => {
      render(<TextField error="This field is required" />);
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("applies error styling classes", () => {
      render(<TextField error="Error message" />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      const inputWrapper = screen.getByRole("textbox").parentElement;

      expect(container).toHaveClass("textfield-has-error");
      expect(inputWrapper).toHaveClass("textfield-state-error");
    });

    it("sets aria-invalid when error is present", () => {
      render(<TextField error="Error message" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("error message has role=alert", () => {
      render(<TextField error="Error message" />);
      const errorElement = screen.getByText("Error message");
      expect(errorElement).toHaveAttribute("role", "alert");
      expect(errorElement).toHaveAttribute("aria-live", "polite");
    });

    it("associates error with input via aria-describedby", () => {
      render(<TextField error="Error message" id="test-input" />);
      const input = screen.getByRole("textbox");
      const errorElement = screen.getByText("Error message");

      expect(input).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining(errorElement.id)
      );
    });
  });

  describe("Helper Text", () => {
    it("displays helper text", () => {
      render(<TextField helperText="This is a helpful hint" />);
      expect(screen.getByText("This is a helpful hint")).toBeInTheDocument();
    });

    it("associates helper text with input via aria-describedby", () => {
      render(<TextField helperText="Helper text" id="test-input" />);
      const input = screen.getByRole("textbox");
      const helperElement = screen.getByText("Helper text");

      expect(input).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining(helperElement.id)
      );
    });

    it("error takes priority over helper text", () => {
      render(<TextField helperText="Helper text" error="Error message" />);

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("shows both error and helper in aria-describedby when both present", () => {
      render(
        <TextField
          helperText="Helper text"
          error="Error message"
          id="test-input"
        />
      );

      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");

      expect(describedBy).toContain("test-input-error");
    });
  });

  describe("Icons", () => {
    it("displays left icon", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      render(<TextField leading={leftIcon} />);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("displays right icon", () => {
      const rightIcon = <span data-testid="right-icon">👁️</span>;
      render(<TextField trailing={rightIcon} />);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("displays both icons simultaneously", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      const rightIcon = <span data-testid="right-icon">👁️</span>;

      render(<TextField leading={leftIcon} trailing={rightIcon} />);

      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("applies hasLeftIcon class when leftIcon is present", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      render(<TextField leading={leftIcon} />);

      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass("textfield-has-left-icon");
    });

    it("applies hasRightIcon class when rightIcon is present", () => {
      const rightIcon = <span data-testid="right-icon">👁️</span>;
      render(<TextField trailing={rightIcon} />);

      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass("textfield-has-right-icon");
    });

    it("marks icons as aria-hidden", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      render(<TextField leading={leftIcon} />);

      const iconContainer = screen.getByTestId("left-icon").parentElement;
      expect(iconContainer).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Loading State", () => {
    it("displays spinner when loading=true", () => {
      render(<TextField loading />);
      const spinner = screen
        .getByRole("textbox")
        .parentElement?.querySelector(".textfield-spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("disables input when loading=true", () => {
      render(<TextField loading />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("applies disabled styling classes when loading", () => {
      render(<TextField loading />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      const inputWrapper = screen.getByRole("textbox").parentElement;

      expect(container).toHaveClass("textfield-is-disabled");
      expect(inputWrapper).toHaveClass("textfield-state-disabled");
    });

    it("hides right icon when loading", () => {
      const rightIcon = <span data-testid="right-icon">👁️</span>;
      render(<TextField trailing={rightIcon} loading />);

      expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    });

    it("applies hasRightIcon class when loading (for spinner)", () => {
      render(<TextField loading />);
      const inputWrapper = screen.getByRole("textbox").parentElement;
      expect(inputWrapper).toHaveClass("textfield-has-right-icon");
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled=true", () => {
      render(<TextField disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("applies disabled styling classes", () => {
      render(<TextField disabled />);
      const container = screen.getByRole("textbox").closest(".textfield-root");
      const inputWrapper = screen.getByRole("textbox").parentElement;

      expect(container).toHaveClass("textfield-is-disabled");
      expect(inputWrapper).toHaveClass("textfield-state-disabled");
    });
  });

  describe("Input Types", () => {
    it("supports different input types", () => {
      const types = [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
      ] as const;

      types.forEach((type) => {
        const { unmount } = render(
          <TextField type={type} data-testid={`input-${type}`} />
        );
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute("type", type);
        unmount();
      });
    });

    it("uses text as default type", () => {
      render(<TextField />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when input value changes", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<TextField onChange={onChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(onChange).toHaveBeenCalled();
    });

    it("calls onBlur when input loses focus", async () => {
      const onBlur = vi.fn();
      const user = userEvent.setup();

      render(<TextField onBlur={onBlur} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalled();
    });

    it("calls onFocus when input gains focus", async () => {
      const onFocus = vi.fn();
      const user = userEvent.setup();

      render(<TextField onFocus={onFocus} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(onFocus).toHaveBeenCalled();
    });

    it("calls onKeyDown when key is pressed", () => {
      const onKeyDown = vi.fn();

      render(<TextField onKeyDown={onKeyDown} />);

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(onKeyDown).toHaveBeenCalled();
    });

    it("does not call events when disabled", async () => {
      const onChange = vi.fn();
      const onFocus = vi.fn();
      const user = userEvent.setup();

      render(<TextField disabled onChange={onChange} onFocus={onFocus} />);

      const input = screen.getByRole("textbox");

      // Try to interact with disabled input
      await user.click(input);
      await user.type(input, "test");

      expect(onFocus).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("supports custom aria-label", () => {
      render(<TextField aria-label="Custom label" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-label",
        "Custom label"
      );
    });

    it("supports custom aria-describedby", () => {
      render(<TextField aria-describedby="custom-description" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining("custom-description")
      );
    });

    it("supports custom aria-invalid", () => {
      render(<TextField aria-invalid="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("combines aria-describedby values correctly", () => {
      render(
        <TextField
          aria-describedby="custom-desc"
          helperText="Helper text"
          error="Error message"
          id="test-input"
        />
      );

      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");

      expect(describedBy).toContain("custom-desc");
      expect(describedBy).toContain("test-input-error");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextField ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByRole("textbox"));
    });

    it("allows calling methods through ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextField ref={ref} />);

      const focusSpy = vi.spyOn(ref.current!, "focus");
      ref.current!.focus();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("Custom Props", () => {
    it("forwards HTML attributes to input element", () => {
      render(
        <TextField
          data-testid="custom-input"
          autoComplete="email"
          maxLength={50}
          minLength={3}
        />
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("autocomplete", "email");
      expect(input).toHaveAttribute("maxlength", "50");
      expect(input).toHaveAttribute("minlength", "3");
    });

    it("supports name attribute", () => {
      render(<TextField name="email-field" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "name",
        "email-field"
      );
    });
  });

  describe("Combined States", () => {
    it("loading state overrides disabled prop", () => {
      render(<TextField loading disabled={false} />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("displays correct classes for multiple states", () => {
      render(
        <TextField
          variant="filled"
          size="large"
          fullWidth
          required
          error="Error message"
          loading
          className="custom-class"
        />
      );

      const container = screen.getByRole("textbox").closest(".textfield-root");
      const inputWrapper = screen.getByRole("textbox").parentElement;

      expect(container).toHaveClass("textfield-root");
      expect(container).toHaveClass("textfield-full-width");
      expect(container).toHaveClass("textfield-has-error");
      expect(container).toHaveClass("textfield-is-disabled");
      expect(container).toHaveClass("textfield-is-required");
      expect(container).toHaveClass("custom-class");

      expect(inputWrapper).toHaveClass("textfield-variant-filled");
      expect(inputWrapper).toHaveClass("textfield-size-large");
      expect(inputWrapper).toHaveClass("textfield-state-error");
      expect(inputWrapper).toHaveClass("textfield-state-disabled");
    });

    it("error and helper text with icons", () => {
      const leftIcon = <span data-testid="left-icon">🔍</span>;
      const rightIcon = <span data-testid="right-icon">👁️</span>;

      render(
        <TextField
          leading={leftIcon}
          trailing={rightIcon}
          error="Error message"
          helperText="Helper text"
        />
      );

      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument(); // Error takes priority
    });
  });
});
