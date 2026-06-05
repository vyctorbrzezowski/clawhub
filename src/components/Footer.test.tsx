/* @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: (props: { children: ReactNode; to?: string; className?: string }) => (
    <a href={props.to ?? "/"} className={props.className}>
      {props.children}
    </a>
  ),
}));

import { Footer } from "./Footer";
import {
  OPENCLAW_BLOG_CLAWHUB_URL,
  OPENCLAW_CLAWHUB_DOCS_URL,
  OPENCLAW_ECOSYSTEM_URL,
} from "../lib/nav-items";

describe("Footer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mockMatchMedia(matches: boolean) {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  }

  it("renders brand, ecosystem marks with logos, and four nav columns", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector(".footer-v2-brand-lockup")?.getAttribute("href")).toBe("/");
    expect(container.querySelector(".footer-v2-eco-link")?.getAttribute("href")).toBe(
      OPENCLAW_CLAWHUB_DOCS_URL,
    );
    expect(screen.queryByRole("link", { name: /Built alongside/i })).toBeNull();
    expect(screen.getByText(/Built alongside/i)).toBeTruthy();
    expect(screen.getByText("Explore our ecosystem")).toBeTruthy();
    expect(container.querySelector(".footer-v2-eco-mark-all")?.getAttribute("href")).toBe(
      OPENCLAW_ECOSYSTEM_URL,
    );
    expect(container.querySelector('.footer-v2-eco-mark img[src*="clawhub.png"]')).toBeTruthy();
    expect(container.querySelector('.footer-v2-eco-mark img[src*="crabbox.svg"]')).toBeTruthy();
    expect(container.querySelectorAll(".footer-v2-eco-mark:not(.footer-v2-eco-mark-all)").length).toBeGreaterThan(
      8,
    );
    expect(screen.getByRole("link", { name: /discrawl/i })).toBeTruthy();

    const columns = container.querySelectorAll(".footer-col");
    expect(columns).toHaveLength(4);

    const ecosystem = screen.getByRole("heading", { name: "Ecosystem" }).closest(".footer-col");
    expect(
      within(ecosystem as HTMLElement)
        .getByRole("link", { name: "Overview" })
        .getAttribute("href"),
    ).toBe(OPENCLAW_ECOSYSTEM_URL);
    expect(
      within(ecosystem as HTMLElement).getByRole("link", { name: "Blog" }).getAttribute("href"),
    ).toBe(OPENCLAW_BLOG_CLAWHUB_URL);
  });

  it("collapses footer sections by heading until toggled open", async () => {
    mockMatchMedia(true);
    render(<Footer />);

    const browseToggle = screen.getByRole("button", { name: "Browse" });
    const browseLinks = document.getElementById("footer-section-browse-links");

    await waitFor(() => expect(browseToggle.getAttribute("aria-expanded")).toBe("false"));
    fireEvent.click(browseToggle);
    expect(browseToggle.getAttribute("aria-expanded")).toBe("true");
    expect(
      within(browseLinks as HTMLElement)
        .getByRole("link", { name: "Skills" })
        .getAttribute("href"),
    ).toBe("/skills");
  });
});
