import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Divider } from "../../../src/components/divider";

describe("Divider Component", () => {
  it("renders a divider with no text", () => {
    render(<Divider data-testid="divider-no-text" />);
    const divider = screen.getByTestId("divider-no-text");

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass("fui-divider");
    expect(divider.querySelector(".fui-divider__line")).toBeInTheDocument();
    expect(divider.querySelector(".fui-divider__text")).not.toBeInTheDocument();
  });

  it("renders a divider with text", () => {
    const dividerText = "OR";
    render(<Divider data-testid="divider-with-text">{dividerText}</Divider>);
    const divider = screen.getByTestId("divider-with-text");
    const textElement = screen.getByText(dividerText);

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass("fui-divider");
    expect(divider.querySelectorAll(".fui-divider__line")).toHaveLength(2);
    expect(textElement).toBeInTheDocument();
    expect(textElement.closest(".fui-divider__text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Divider data-testid="divider-custom-class" className="custom-class" />
    );
    const divider = screen.getByTestId("divider-custom-class");

    expect(divider).toHaveClass("fui-divider");
    expect(divider).toHaveClass("custom-class");
  });

  it("passes other props to the div element", () => {
    render(<Divider data-testid="test-divider" aria-label="divider" />);
    const divider = screen.getByTestId("test-divider");

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass("fui-divider");
    expect(divider).toHaveAttribute("aria-label", "divider");
  });
});
