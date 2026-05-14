/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowError({ message }: { message: string }) {
  throw new Error(message);
}

describe("ErrorBoundary", () => {
  it("renders fallback with role=alert when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain("Test error");
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div role="alert">Custom fallback</div>}>
        <ThrowError message="Test error" />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.textContent).toBe("Custom fallback");
  });

  it("clears error when Try again is clicked", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeDefined();

    const tryAgain = screen.getByRole("button", { name: /try again/i });
    tryAgain.click();

    rerender(
      <ErrorBoundary>
        <div>Recovered content</div>
      </ErrorBoundary>,
    );

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("Recovered content")).toBeDefined();
  });
});
