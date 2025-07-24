import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
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
    icon: "button-icon",
    content: "button-content",
  },
}));

describe("Button", () => {
  describe("Basic Rendering", () => {
    it("renders without errors", () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("displays child text content", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders as button element by default", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Variants", () => {
    const variants: Array<IButtonProps["variant"]> = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "danger",
    ];

    it.each(variants)("applies correct class for %s variant", (variant) => {
      render(<Button variant={variant}>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(`button-variant-${variant}`);
    });

    it("uses primary as default variant", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-variant-primary");
    });
  });

  describe("Sizes", () => {
    const sizes: Array<IButtonProps["size"]> = ["small", "medium", "large"];

    it.each(sizes)("applies correct class for %s size", (size) => {
      render(<Button size={size}>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(`button-size-${size}`);
    });

    it("uses medium as default size", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-size-medium");
    });
  });

  describe("Loading State", () => {
    it("displays spinner when loading=true", () => {
      render(<Button loading>Loading Button</Button>);
      const spinner = screen
        .getByRole("button")
        .querySelector(".button-spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("makes button disabled when loading=true", () => {
      render(<Button loading>Loading Button</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("applies loading state class", () => {
      render(<Button loading>Test</Button>);
      expect(screen.getByRole("button")).toHaveClass("button-state-loading");
    });

    it("sets aria-busy=true when loading=true", () => {
      render(<Button loading>Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("hides icons during loading", () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      const rightIcon = <span data-testid="right-icon">→</span>;

      render(
        <Button loading leading={leftIcon} trailing={rightIcon}>
          Loading
        </Button>
      );

      expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("makes button disabled when disabled=true", () => {
      render(<Button disabled>Disabled Button</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("applies disabled state class", () => {
      render(<Button disabled>Test</Button>);
      expect(screen.getByRole("button")).toHaveClass("button-state-disabled");
    });
  });

  describe("Icons", () => {
    it("displays left icon", () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      render(<Button leading={leftIcon}>With Left Icon</Button>);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("displays right icon", () => {
      const rightIcon = <span data-testid="right-icon">→</span>;
      render(<Button trailing={rightIcon}>With Right Icon</Button>);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("displays both icons simultaneously", () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      const rightIcon = <span data-testid="right-icon">→</span>;

      render(
        <Button leading={leftIcon} trailing={rightIcon}>
          With Both Icons
        </Button>
      );

      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("marks icons as aria-hidden", () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      render(<Button leading={leftIcon}>Test</Button>);

      const iconContainer = screen.getByTestId("left-icon").parentElement;
      expect(iconContainer).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("FullWidth", () => {
    it("applies fullWidth class when fullWidth=true", () => {
      render(<Button fullWidth>Full Width Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("button-full-width");
    });

    it("does not apply fullWidth class by default", () => {
      render(<Button>Normal Button</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("button-full-width");
    });
  });

  describe("Event Handling", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Clickable Button</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} loading>
          Loading Button
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles keyboard events", () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Test</Button>);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("uses children as aria-label if not specified", () => {
      render(<Button>Save Document</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Save Document"
      );
    });

    it("uses custom aria-label", () => {
      render(<Button aria-label="Custom Label">❤️</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Custom Label"
      );
    });

    it("uses children as title if not specified", () => {
      render(<Button>Help Information</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "title",
        "Help Information"
      );
    });

    it("uses custom title", () => {
      render(<Button title="Custom Title">❓</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "title",
        "Custom Title"
      );
    });

    it("supports aria-describedby", () => {
      render(<Button aria-describedby="help-text">Need Help</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-describedby",
        "help-text"
      );
    });

    it("does not set aria-label for complex content", () => {
      render(
        <Button>
          <span>Complex</span> <strong>Content</strong>
        </Button>
      );
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    });
  });

  describe("Button Types", () => {
    it("supports type=submit", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("supports type=reset", () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("Custom Props", () => {
    it("forwards custom HTML attributes", () => {
      render(
        <Button data-testid="custom-button" id="my-button">
          Test
        </Button>
      );
      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("id", "my-button");
    });

    it("merges custom className with base classes", () => {
      render(<Button className="my-custom-class">Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-root");
      expect(button).toHaveClass("my-custom-class");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Test</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole("button"));
    });

    it("allows calling methods through ref", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Test</Button>);

      const focusSpy = vi.spyOn(ref.current!, "focus");
      ref.current!.focus();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("Content", () => {
    it("wraps text content in span with content class", () => {
      render(<Button>Text Content</Button>);
      const contentSpan = screen.getByText("Text Content");
      expect(contentSpan).toHaveClass("button-content");
    });

    it("wraps JSX content in span with content class", () => {
      render(
        <Button>
          <span>JSX Content</span>
        </Button>
      );
      const contentSpan = screen.getByText("JSX Content").parentElement;
      expect(contentSpan).toHaveClass("button-content");
    });

    it("renders without content if children are not provided", () => {
      render(<Button />);
      const button = screen.getByRole("button");
      expect(button.querySelector(".button-content")).not.toBeInTheDocument();
    });
  });

  describe("Combined States", () => {
    it("loading state overrides disabled", () => {
      render(
        <Button loading disabled={false}>
          Test
        </Button>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("displays correct classes for multiple states", () => {
      render(
        <Button
          variant="danger"
          size="large"
          loading
          fullWidth
          className="custom-class"
        >
          Complex Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button-root");
      expect(button).toHaveClass("button-variant-danger");
      expect(button).toHaveClass("button-size-large");
      expect(button).toHaveClass("button-state-loading");
      expect(button).toHaveClass("button-full-width");
      expect(button).toHaveClass("custom-class");
    });
  });
});
