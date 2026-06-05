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

import { HomeDiscoverSection } from "../components/HomeDiscoverSection";

describe("HomeDiscoverSection", () => {
  it("renders editor pick, trending rail, and collection rows", () => {
    render(<HomeDiscoverSection />);

    expect(screen.getByRole("region", { name: "Curated discovery" })).toBeTruthy();
    expect(screen.getByText("Trending stacks")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Collections", level: 2 })).toBeTruthy();
    expect(screen.getByText(/Grouped by domain/i)).toBeTruthy();
    expect(screen.getAllByText("Peter Steinberger").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("NVIDIA AI")).toBeTruthy();
    expect(screen.queryByText("+43%")).toBeNull();
    expect(document.querySelector(".home-v2-stack-trend-growth")).toBeNull();
    expect(screen.getByText("Data & APIs")).toBeTruthy();
    expect(screen.getByText("REST")).toBeTruthy();
    expect(document.querySelector(".home-v2-stack-trend-rail")).toBeTruthy();
    expect(document.querySelectorAll(".home-v2-stack-trend-card").length).toBe(6);
    expect(screen.queryByRole("button", { name: "Show previous trending stacks" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show more trending stacks" })).toBeNull();
    expect(document.querySelector(".home-v2-stack-trend-viewport")).toBeTruthy();
    expect(document.querySelectorAll(".home-v2-collection-card").length).toBe(10);
  });
});
