import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./index";
import type { IButtonProps } from "./button";

vi.mock("./styles.module.scss", () => ({
  default: {
    root: "button-root",
    variant__primary: "button-variant-primary",
    variant__secondary: "button-variant-secondary",
    variant__outline: "button-variant-outline",
    variant__ghost: "button-variant-ghost",
    variant__danger: "button-variant-danger",
    size__small: "button-size-small",
    size__medium: "button-size-medium",
    size__large: "button-size-large",
    state__loading: "button-state-loading",
    state__disabled: "button-state-disabled",
    fullWidth: "button-full-width",
    spinner: "button-spinner",
  },
}));

describe("Button", () => {
  // Basic functionality - only essential tests
  it("renders and displays content", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  // Variants - core API
  describe("Variants", () => {
    const variants: Array<IButtonProps["variant"]> = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "danger",
    ];

    it.each(variants)("applies %s variant class", (variant) => {
      render(<Button variant={variant}>Test</Button>);
      expect(screen.getByRole("button")).toHaveClass(
        `button-variant-${variant}`
      );
    });

    it("uses primary as default", () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole("button")).toHaveClass("button-variant-primary");
    });
  });

  // Sizes - core API
  describe("Sizes", () => {
    const sizes: Array<IButtonProps["size"]> = ["small", "medium", "large"];

    it.each(sizes)("applies %s size class", (size) => {
      render(<Button size={size}>Test</Button>);
      expect(screen.getByRole("button")).toHaveClass(`button-size-${size}`);
    });
  });

  // Loading state - critical functionality
  it("handles loading state correctly", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("button-state-loading");
    expect(button.querySelector(".button-spinner")).toBeInTheDocument();
  });

  // Disabled state
  it("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Icons - essential API
  it("renders with icons", () => {
    render(
      <Button
        leading={<span data-testid="left">←</span>}
        trailing={<span data-testid="right">→</span>}
      >
        Text
      </Button>
    );

    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  // Full width
  it("applies fullWidth class", () => {
    render(<Button fullWidth>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("button-full-width");
  });

  // Event handling - critical functionality
  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("prevents click when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("prevents click when loading", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} loading>
        Click me
      </Button>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Custom props
  it("applies custom className", () => {
    render(<Button className="custom">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});
