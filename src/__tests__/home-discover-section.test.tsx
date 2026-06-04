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
  it("renders trending stacks and editorial collections", () => {
    render(<HomeDiscoverSection />);

    expect(screen.getByRole("region", { name: "Curated stacks and collections" })).toBeTruthy();
    expect(screen.getByText("Trending stacks")).toBeTruthy();
    expect(screen.getByText("Peter Steinberger's stack")).toBeTruthy();
    expect(screen.getByText("NVIDIA AI stack")).toBeTruthy();
    expect(screen.getByText("Peter Steinberger")).toBeTruthy();
  });
});
