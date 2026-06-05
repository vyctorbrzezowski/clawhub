/* @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    to,
  }: {
    children: React.ReactNode;
    className?: string;
    to?: string;
  }) => (
    <a className={className} href={typeof to === "string" ? to : "/"}>
      {children}
    </a>
  ),
}));

import { HomeFeaturedStackSection } from "../components/HomeFeaturedStackSection";

describe("HomeFeaturedStackSection", () => {
  it("renders editor pick and staff curated columns", () => {
    render(<HomeFeaturedStackSection />);

    expect(screen.getByRole("region", { name: "Featured collections" })).toBeTruthy();
    expect(document.querySelector(".home-v2-featured-spotlight-grid")).toBeTruthy();
    expect(document.querySelectorAll(".home-v2-featured-spotlight-col")).toHaveLength(2);
    expect(screen.getByText("Claws for your Claw 🦞")).toBeTruthy();
    expect(screen.getByText("OpenClaw essentials")).toBeTruthy();
    expect(document.querySelector(".home-v2-stack-feature--hero")).toBeTruthy();
    expect(document.querySelector(".home-v2-stack-feature--muted")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Collections", level: 2 })).toBeTruthy();
    expect(screen.getByText(/Grouped by domain/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: "See all" })).toBeTruthy();
    expect(screen.getByText("Security essentials")).toBeTruthy();
    expect(screen.getByText("Coding agents")).toBeTruthy();
    expect(document.querySelector(".home-v2-stack-feature-deck")).toBeTruthy();
    expect(screen.getByRole("group", { name: "Featured skills preview" })).toBeTruthy();
    expect(screen.getByText("Skill Creator")).toBeTruthy();
    expect(screen.getByText(/Reads diffs like a release gate/i)).toBeTruthy();
    expect(screen.getByText("Risk scan")).toBeTruthy();
  });
});
