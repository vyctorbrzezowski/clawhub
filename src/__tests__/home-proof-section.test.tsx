/* @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { convexQueryMock } = vi.hoisted(() => ({
  convexQueryMock: vi.fn(),
}));

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

vi.mock("../convex/client", () => ({
  convexHttp: {
    query: (...args: unknown[]) => convexQueryMock(...args),
  },
}));

vi.mock("../../convex/_generated/api", () => ({
  api: {
    skills: {
      countPublicSkills: "skills:countPublicSkills",
    },
  },
}));

import { HomeProofSection } from "../components/HomeProofSection";

describe("HomeProofSection", () => {
  it("renders proof tiers and live skill count when available", async () => {
    convexQueryMock.mockResolvedValue(52_700);

    render(<HomeProofSection />);

    expect(document.querySelector('.home-v2-proof-eyebrow-mark[src="/og-clawhub-watermark.png"]')).toBeTruthy();
    expect(screen.getByText("About ClawHub")).toBeTruthy();
    expect(screen.getByText("The registry for OpenClaw agents")).toBeTruthy();
    expect(screen.getByText("One catalog, every surface")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Skills" })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("52.7k")).toBeTruthy();
    });
    expect(convexQueryMock).toHaveBeenCalledWith("skills:countPublicSkills", {});
  });
});
