import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Placeholder } from "./index";

vi.mock("./styles.module.scss", () => ({
  default: {
    placeholder: "placeholder",
    icon: "icon",
    title: "title",
    description: "description",
    action: "action",
    variant__loading: "variant-loading",
    variant__error: "variant-error",
    variant__empty: "variant-empty",
    variant__notFound: "variant-not-found",
    size__small: "size-small",
    size__medium: "size-medium",
    size__large: "size-large",
  },
}));

vi.mock("../loader", () => ({
  Loader: ({ size }: { size?: string }) => (
    <div data-testid="loader" data-size={size}>
      Loading spinner
    </div>
  ),
}));

describe("Placeholder", () => {
  it("renders without errors", () => {
    render(<Placeholder />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("applies default variant and size classes", () => {
    const { container } = render(<Placeholder />);
    const placeholder = container.firstChild as HTMLElement;
    expect(placeholder).toHaveClass(
      "placeholder",
      "variant-empty",
      "size-medium"
    );
  });

  describe("Variants", () => {
    it("renders loading variant with loader", () => {
      render(<Placeholder variant="loading" />);
      expect(screen.getByTestId("loader")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("Please wait")).toBeInTheDocument();
    });

    it("renders error variant with default content", () => {
      render(<Placeholder variant="error" />);
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
      expect(screen.getByText("Please try again")).toBeInTheDocument();
    });

    it("renders empty variant with default content", () => {
      render(<Placeholder variant="empty" />);
      expect(screen.getByText("No data")).toBeInTheDocument();
      expect(screen.getByText("There is nothing here yet")).toBeInTheDocument();
    });

    it("renders not-found variant with default content", () => {
      render(<Placeholder variant="not-found" />);
      expect(screen.getByText("Not found")).toBeInTheDocument();
      expect(
        screen.getByText("The requested resource was not found")
      ).toBeInTheDocument();
    });
  });

  describe("Custom Content", () => {
    it("renders custom title and description", () => {
      render(
        <Placeholder title="Custom Title" description="Custom Description" />
      );
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Description")).toBeInTheDocument();
    });

    it("renders custom icon", () => {
      render(<Placeholder icon={<span data-testid="custom-icon">🎉</span>} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders action element", () => {
      render(
        <Placeholder
          action={<button data-testid="action-button">Retry</button>}
        />
      );
      expect(screen.getByTestId("action-button")).toBeInTheDocument();
    });
  });

  describe("Sizes", () => {
    it("applies small size class", () => {
      const { container } = render(<Placeholder size="small" />);
      const placeholder = container.firstChild as HTMLElement;
      expect(placeholder).toHaveClass("size-small");
    });

    it("applies large size class", () => {
      const { container } = render(<Placeholder size="large" />);
      const placeholder = container.firstChild as HTMLElement;
      expect(placeholder).toHaveClass("size-large");
    });

    it("passes correct size to loader in loading variant", () => {
      render(<Placeholder variant="loading" size="large" />);
      const loader = screen.getByTestId("loader");
      expect(loader).toHaveAttribute("data-size", "large");
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <Placeholder className="custom-placeholder" />
    );
    const placeholder = container.firstChild as HTMLElement;
    expect(placeholder).toHaveClass("custom-placeholder");
  });
});
