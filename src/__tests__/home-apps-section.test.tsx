/* @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    to,
    search,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
    search?: { q?: string };
    "aria-label"?: string;
  }) => (
    <a
      className={className}
      aria-label={ariaLabel}
      href={
        typeof to === "string"
          ? `${to}${search?.q ? `?q=${encodeURIComponent(search.q)}` : ""}`
          : "/"
      }
    >
      {children}
    </a>
  ),
}));

import { HomeAppsSection } from "../components/HomeAppsSection";

describe("HomeAppsSection", () => {
  it("renders the apps constellation with shortcut links", () => {
    render(<HomeAppsSection />);

    expect(screen.getByRole("heading", { name: "Skills for your apps" })).toBeTruthy();
    expect(screen.getByText("Shortcuts")).toBeTruthy();
    expect(screen.getByText("Google Chrome")).toBeTruthy();
    expect(screen.getByText("Raycast")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open full search/i })).toBeTruthy();
    expect(screen.getByText("18 apps")).toBeTruthy();
    expect(document.querySelectorAll(".home-v2-app-pill").length).toBe(18);
    expect(screen.getByRole("link", { name: /Google Chrome/i })?.getAttribute("href")).toContain(
      "chrome",
    );
  });
});
