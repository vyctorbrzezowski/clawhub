/* @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "../components/EmptyState";

describe("EmptyState", () => {
  it("renders action link without nested button", () => {
    render(<EmptyState title="Nothing here" action={{ label: "Go home", href: "/" }} />);

    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toBeDefined();
    expect(link.querySelector("button")).toBeNull();
  });

  it("renders action button and calls onClick", () => {
    const handleClick = vi.fn();
    render(<EmptyState title="Nothing here" action={{ label: "Retry", onClick: handleClick }} />);

    const button = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
