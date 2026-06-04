/* @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();
const convexQueryMock = vi.fn();
const fetchPluginCatalogMock = vi.fn();

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
  useNavigate: () => navigateMock,
}));

const convexActionMock = vi.fn();

vi.mock("../convex/client", () => ({
  convexHttp: {
    query: (...args: unknown[]) => convexQueryMock(...args),
    action: (...args: unknown[]) => convexActionMock(...args),
  },
}));

vi.mock("../../convex/_generated/api", () => ({
  api: {
    skills: {
      listPublicPageV4: "skills:listPublicPageV4",
    },
    search: {
      searchSkills: "search:searchSkills",
    },
  },
}));

vi.mock("../lib/packageApi", () => ({
  fetchPluginCatalog: (...args: unknown[]) => fetchPluginCatalogMock(...args),
}));

import { HomeListingSection } from "../components/HomeListingSection";

describe("HomeListingSection", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    convexQueryMock.mockReset();
    convexActionMock.mockReset();
    fetchPluginCatalogMock.mockReset();
    convexQueryMock.mockResolvedValue({
      page: [
        {
          skill: {
            _id: "skills:1",
            slug: "demo-skill",
            displayName: "Demo Skill",
            summary: "A helpful skill.",
            stats: { stars: 12, downloads: 340 },
          },
          ownerHandle: "builder",
        },
      ],
    });
    fetchPluginCatalogMock.mockResolvedValue({
      items: [
        {
          name: "@openclaw/whatsapp",
          displayName: "WhatsApp",
          runtimeId: "whatsapp",
          family: "code-plugin",
          channel: "official",
          isOfficial: true,
          ownerHandle: "openclaw",
          summary: "OpenClaw WhatsApp channel plugin for WhatsApp Web chats.",
          createdAt: 1,
          updatedAt: 2,
          latestVersion: "2026.6.1",
          stats: { stars: 8, downloads: 120, installs: 0, versions: 1 },
        },
        {
          name: "@openclaw/discord",
          displayName: "Discord",
          runtimeId: "discord",
          family: "code-plugin",
          channel: "official",
          isOfficial: true,
          ownerHandle: "openclaw",
          summary: "OpenClaw Discord channel plugin.",
          createdAt: 1,
          updatedAt: 2,
          latestVersion: "2026.6.1",
          stats: { stars: 4, downloads: 90, installs: 0, versions: 1 },
        },
      ],
      nextCursor: null,
    });
  });

  it("renders the listing toolbar and skill cards by default", async () => {
    render(<HomeListingSection />);

    expect(screen.getByRole("group", { name: "Content type" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Officials" })).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText("Demo Skill")).toBeTruthy();
    });
  });

  it("switches to plugins on Officials and loads openclaw catalog", async () => {
    render(<HomeListingSection />);

    fireEvent.click(screen.getByRole("button", { name: "Plugins" }));

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Officials", selected: true })).toBeTruthy();
      expect(screen.getByText("WhatsApp")).toBeTruthy();
      expect(screen.getAllByText("@openclaw").length).toBeGreaterThan(0);
    });

    const whatsappIcon = document.querySelector(
      'img.marketplace-icon-image[src="https://cdn.simpleicons.org/whatsapp/25D366"]',
    );
    expect(whatsappIcon).toBeTruthy();

    expect(fetchPluginCatalogMock).toHaveBeenCalledWith(
      expect.objectContaining({ isOfficial: true }),
    );
  });

  it("shows hardcoded openclaw officials when the plugin API is empty", async () => {
    fetchPluginCatalogMock.mockResolvedValue({ items: [], nextCursor: null });

    render(<HomeListingSection />);
    fireEvent.click(screen.getByRole("button", { name: "Plugins" }));

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Officials", selected: true })).toBeTruthy();
      expect(screen.getByText("WhatsApp")).toBeTruthy();
      expect(screen.getByText("Discord")).toBeTruthy();
      expect(screen.getByText("Matrix")).toBeTruthy();
      expect(screen.getByText("Codex")).toBeTruthy();
      expect(screen.queryByText("Quiet shelf")).toBeNull();
      expect(screen.getAllByText("@openclaw").length).toBeGreaterThan(0);
    });

    const whatsappIcon = document.querySelector(
      'img.marketplace-icon-image[src="https://cdn.simpleicons.org/whatsapp/25D366"]',
    );
    expect(whatsappIcon).toBeTruthy();
  });

  it("shows hardcoded openclaw officials when the plugin API fails", async () => {
    fetchPluginCatalogMock.mockRejectedValue(new Error("network"));

    render(<HomeListingSection />);
    fireEvent.click(screen.getByRole("button", { name: "Plugins" }));

    await waitFor(() => {
      expect(screen.getByText("WhatsApp")).toBeTruthy();
      expect(screen.queryByText("Quiet shelf")).toBeNull();
      expect(screen.queryByText("Listings took a coffee break")).toBeNull();
    });
  });

  it("opens listing search from the toolbar icon and with slash", async () => {
    convexActionMock.mockResolvedValue([
      {
        skill: {
          _id: "skills:1",
          slug: "alpha-skill",
          displayName: "Alpha Skill",
          summary: "Alpha",
          stats: { stars: 1, downloads: 1 },
        },
        ownerHandle: "builder",
      },
    ]);

    render(<HomeListingSection />);

    fireEvent.click(screen.getByRole("button", { name: "Search catalog" }));
    expect(document.querySelector(".home-v2-listing-search.is-open")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close search" }));
    expect(document.querySelector(".home-v2-listing-search.is-open")).toBeNull();

    fireEvent.keyDown(document, { key: "/" });

    const searchInput = await screen.findByRole("searchbox", { name: "Search skills" });
    expect(document.querySelector(".home-v2-listing-search.is-open")).toBeTruthy();

    fireEvent.change(searchInput, { target: { value: "alpha" } });

    await waitFor(() => {
      expect(convexActionMock).toHaveBeenCalledWith("search:searchSkills", {
        query: "alpha",
        limit: 20,
        highlightedOnly: undefined,
      });
      expect(screen.getByText("Alpha Skill")).toBeTruthy();
    });
  });

  it("groups search, category, and view in the actions rail with even spacing", () => {
    render(<HomeListingSection />);

    const sort = document.querySelector(".home-v2-listing-sort");
    expect(sort?.querySelector(".home-v2-listing-search-trigger")).toBeNull();

    const rail = document.querySelector(".home-v2-listing-actions-rail");
    expect(rail).toBeTruthy();
    expect(rail?.classList.contains("has-category")).toBe(true);
    expect(rail?.querySelector(".home-v2-listing-search-trigger")).toBeTruthy();
    expect(rail?.querySelector(".home-v2-listing-category-menu")).toBeTruthy();
    expect(rail?.querySelector(".home-v2-listing-view")).toBeTruthy();
  });

  it("renders browse taxonomy category select for skills", () => {
    render(<HomeListingSection />);

    const categorySelect = screen.getByRole("combobox", { name: "Category" });
    expect(categorySelect).toBeTruthy();
    expect(categorySelect.textContent).toContain("All categories");

    fireEvent.click(categorySelect);
    expect(screen.getByRole("option", { name: "All categories" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Data, APIs & Integrations" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Security, Vetting & Trust" })).toBeTruthy();
  });

  it("shows see more when the first page is full and the API reports more", async () => {
    convexQueryMock.mockResolvedValue({
      page: Array.from({ length: 20 }, (_, index) => ({
        skill: {
          _id: `skills:${index}`,
          slug: `skill-${index}`,
          displayName: `Skill ${index}`,
          summary: "Summary",
          stats: { stars: 1, downloads: 1 },
        },
        ownerHandle: "builder",
      })),
      hasMore: true,
    });

    render(<HomeListingSection />);

    await waitFor(() => {
      expect(screen.getByText("Skill 19")).toBeTruthy();
    });
    expect(screen.queryByText("Skill 20")).toBeNull();
    expect(screen.getByRole("button", { name: "See more" })).toBeTruthy();
  });

  it("expands the listing preview when see more is clicked", async () => {
    convexQueryMock.mockResolvedValue({
      page: Array.from({ length: 35 }, (_, index) => ({
        skill: {
          _id: `skills:${index}`,
          slug: `skill-${index}`,
          displayName: `Skill ${index}`,
          summary: "Summary",
          stats: { stars: 1, downloads: 1 },
        },
        ownerHandle: "builder",
      })),
    });

    render(<HomeListingSection />);

    await waitFor(() => {
      expect(screen.getByText("Skill 0")).toBeTruthy();
    });
    expect(screen.queryByText("Skill 20")).toBeNull();
    expect(screen.getByText("Skill 19")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "See more" }));

    await waitFor(() => {
      expect(screen.getByText("Skill 34")).toBeTruthy();
    });
    expect(screen.queryByRole("button", { name: "See more" })).toBeNull();
  });

  it("requests official-only skills for the Officials tab", async () => {
    render(<HomeListingSection />);

    await waitFor(() => {
      expect(screen.getByText("Demo Skill")).toBeTruthy();
    });

    convexQueryMock.mockClear();
    fireEvent.click(screen.getByRole("tab", { name: "Officials" }));

    await waitFor(() => {
      expect(convexQueryMock).toHaveBeenCalledWith(
        "skills:listPublicPageV4",
        expect.objectContaining({ officialOnly: true }),
      );
    });
  });

  it("refetches skills when a category is selected", async () => {
    render(<HomeListingSection />);

    await waitFor(() => {
      expect(screen.getByText("Demo Skill")).toBeTruthy();
    });

    convexQueryMock.mockClear();
    fireEvent.click(screen.getByRole("combobox", { name: "Category" }));
    fireEvent.click(screen.getByRole("option", { name: "Coding & Dev Tools" }));

    await waitFor(() => {
      expect(convexQueryMock).toHaveBeenCalledWith(
        "skills:listPublicPageV4",
        expect.objectContaining({ categorySlug: "dev-tools" }),
      );
    });
  });

});
