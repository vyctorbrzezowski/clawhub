/* @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    to,
    search,
    params,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
    search?: { q?: string };
    params?: { name?: string };
    "aria-label"?: string;
  }) => {
    let href = typeof to === "string" ? to : "/";
    if (params?.name) {
      href = `/plugins/${encodeURIComponent(params.name)}`;
    } else if (search?.q) {
      href = `${href}?q=${encodeURIComponent(search.q)}`;
    }
    return (
      <a className={className} aria-label={ariaLabel} href={href}>
        {children}
      </a>
    );
  },
}));

import { HomeAppsSection } from "../components/HomeAppsSection";

describe("HomeAppsSection", () => {
  it("renders skills on the left and official plugins on the right", () => {
    render(<HomeAppsSection />);

    expect(screen.getByRole("heading", { name: "Skills for your apps" })).toBeTruthy();
    expect(screen.getByText("Skills")).toBeTruthy();
    expect(screen.getByText("Plugins")).toBeTruthy();
    expect(screen.queryByText("Curated picks")).toBeNull();
    expect(document.querySelectorAll(".home-v2-app-pill").length).toBe(18);
    expect(document.querySelectorAll(".home-v2-app-pill--skill").length).toBe(9);
    expect(document.querySelectorAll(".home-v2-app-pill--plugin").length).toBe(9);

    expect(screen.getByText("Google Chrome")).toBeTruthy();
    expect(screen.getByText("WhatsApp")).toBeTruthy();

    expect(screen.getByRole("link", { name: /Google Chrome skill/i })?.getAttribute("href")).toContain(
      "chrome",
    );
    expect(screen.getByRole("link", { name: /WhatsApp plugin/i })?.getAttribute("href")).toContain(
      "%40openclaw%2Fwhatsapp",
    );

    expect(
      document.querySelector('img[src="https://cdn.simpleicons.org/whatsapp/25D366"]'),
    ).toBeTruthy();
  });
});
