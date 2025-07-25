import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

import { Loader } from "./index";

vi.mock("./styles.module.scss", () => ({
  default: {
    root: "root",
    spinner: "spinner",
    size__small: "size-small",
    size__medium: "size-medium",
    size__large: "size-large",
    color__primary: "color-primary",
    color__secondary: "color-secondary",
    color__white: "color-white",
    fullScreenLoader: "full-screen-loader",
  },
}));

describe("Loader", () => {
  it("renders without errors", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies default size and color classes", () => {
    const { container } = render(<Loader />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass("root", "size-medium", "color-primary");
  });

  it("applies custom size classes", () => {
    const { container } = render(<Loader size="large" />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass("size-large");
  });

  it("applies custom color classes", () => {
    const { container } = render(<Loader color="white" />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass("color-white");
  });

  it("applies custom className", () => {
    const { container } = render(<Loader className="custom-loader" />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass("custom-loader");
  });

  it("renders spinner element", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });

  describe("FullScreen", () => {
    it("renders full screen loader", () => {
      render(<Loader.FullScreen />);
      const fullScreenContainer = document.querySelector(".full-screen-loader");
      expect(fullScreenContainer).toBeInTheDocument();
    });

    it("contains regular loader inside", () => {
      const { container } = render(<Loader.FullScreen />);
      const loader = container.querySelector(".root");
      expect(loader).toBeInTheDocument();
    });
  });
});
