import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextField } from "./index";

vi.mock("./styles.module.scss", () => ({
  default: {
    root: "textfield-root",
    label: "textfield-label",
    requiredIndicator: "textfield-required-indicator",
    input: "textfield-input",
    leading: "textfield-leading",
    trailing: "textfield-trailing",
    loading: "textfield-loading",
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
    fullWidth: "textfield-full-width",
  },
}));

vi.mock("../loader", () => ({
  Loader: () => <div data-testid="loader">Loading</div>,
}));

describe("TextField", () => {
  it("renders input with basic props", () => {
    render(<TextField placeholder="Enter text" defaultValue="test" />);

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveValue("test");
  });

  it("renders with label and associates correctly", () => {
    render(<TextField label="Email" required />);

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Email");

    expect(label).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  describe("Variants & Sizes", () => {
    it("applies fullWidth class", () => {
      const { container } = render(<TextField fullWidth />);
      expect(container.firstChild).toHaveClass("textfield-full-width");
    });
  });

  it("handles error state correctly", () => {
    render(<TextField error="This field is required" helperText="Help text" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Error should take priority over helper text
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("displays helper text when no error", () => {
    render(<TextField helperText="This is helpful" />);
    expect(screen.getByText("This is helpful")).toBeInTheDocument();
  });

  it("renders with icons", () => {
    render(
      <TextField
        leading={<span data-testid="leading-icon">@</span>}
        trailing={<span data-testid="trailing-icon">✓</span>}
      />
    );

    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(<TextField loading />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<TextField disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();

    const { container } = render(<TextField disabled />);
    expect(container.firstChild).toHaveClass("textfield-is-disabled");
  });

  it("handles user input", async () => {
    const handleChange = vi.fn();
    const handleBlur = vi.fn();

    const user = userEvent.setup();

    render(<TextField onChange={handleChange} onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "hello");
    expect(handleChange).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it("supports different input types", () => {
    render(<TextField type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("applies custom className and forwards props", () => {
    render(<TextField className="custom" name="test-field" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "test-field");

    const { container } = render(<TextField className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});
