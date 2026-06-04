/* @vitest-environment jsdom */

import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const siteModeMock = vi.fn(() => "skills");
const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: { component?: unknown }) => ({
    __config: config,
  }),
  Link: ({ children, className, to }: { children: ReactNode; className?: string; to?: string }) => (
    <a className={className} href={to ?? "/"}>
      {children}
    </a>
  ),
  useNavigate: () => navigateMock,
}));

vi.mock("convex/react", () => ({
  useAction: () => vi.fn(),
  useQuery: () => undefined,
}));

vi.mock("../../convex/_generated/api", () => ({
  api: {
    souls: {
      list: "souls:list",
    },
    seed: {
      ensureSoulSeeds: "seed:ensureSoulSeeds",
    },
  },
}));

vi.mock("../lib/site", () => ({
  getSiteMode: () => siteModeMock(),
}));

vi.mock("../components/SoulCard", () => ({
  SoulCard: () => <div />,
}));

vi.mock("../components/SoulStats", () => ({
  SoulStatsTripletLine: () => <div />,
}));

describe("home route", () => {
  beforeEach(() => {
    siteModeMock.mockReturnValue("skills");
    navigateMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function renderHome() {
    const { Route } = await import("../routes/index");
    const Component = (Route as unknown as { __config: { component: React.ComponentType } })
      .__config.component;

    render(<Component />);
  }

  function clickHeroLabelTriple() {
    const label = screen.getByText("BUILT BY THE COMMUNITY.");
    act(() => {
      fireEvent.click(label);
      fireEvent.click(label);
      fireEvent.click(label);
    });
    return label;
  }

  it("renders the community hero without catalog sections", async () => {
    await renderHome();

    expect(screen.getByText("BUILT BY THE COMMUNITY.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "200k+ publishers" })).toBeTruthy();
    expect(screen.getByText(/ready in one search\./)).toBeTruthy();
    expect(document.querySelector(".home-v2-carousel-section")).toBeNull();
    expect(document.querySelector(".home-v2-categories")).toBeNull();
    expect(document.querySelector(".home-v2-proof-bar")).toBeNull();
    expect(document.querySelector(".home-v2-trending-section")).toBeNull();
  });

  it("starts the slot machine when the community label is triple-clicked", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-29T00:00:00Z"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    await renderHome();
    const label = clickHeroLabelTriple();

    expect(label.className).toContain("home-v2-hero-label-active");
    expect(document.querySelector(".home-v2-headline-slots")).toBeTruthy();
    expect(document.querySelector(".home-v2-confetti")).toBeTruthy();
  });

  it("rerolls accidental triples on non-jackpot spins", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-29T00:00:00Z"));
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.3);

    await renderHome();
    clickHeroLabelTriple();

    act(() => {
      vi.advanceTimersByTime(2400);
    });

    const slotWords = Array.from(document.querySelectorAll(".home-v2-slot-word")).map(
      (el) => el.textContent,
    );
    expect(slotWords).toHaveLength(3);
    expect(new Set(slotWords).size).toBeGreaterThan(1);
    expect(document.querySelector(".home-v2-headline-jackpot")).toBeNull();
  });

  it("applies the Hack jackpot effect on the 1-in-100 path", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-29T00:00:00Z"));
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.01)
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.5);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    await renderHome();
    clickHeroLabelTriple();

    act(() => {
      vi.advanceTimersByTime(2400);
    });

    expect(
      Array.from(document.querySelectorAll(".home-v2-slot-word")).map((el) => el.textContent),
    ).toEqual(["Hack", "Hack", "Hack"]);
    expect(document.querySelector(".home-v2-headline-hack")).toBeTruthy();
    expect(document.querySelector(".home-v2-hack-lobster")).toBeTruthy();
  });
});
