/* @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useQueryMock = vi.fn();
const useAuthStatusMock = vi.fn();

let searchMock: Record<string, unknown> = {};

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: { component?: unknown; validateSearch?: unknown }) => ({
    __config: config,
    useSearch: () => searchMock,
  }),
  Link: ({
    children,
    to,
    ...props
  }: {
    children?: ReactNode;
    to?: string;
  } & Record<string, unknown>) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useMutation: () => vi.fn(),
}));

vi.mock("../lib/useAuthStatus", () => ({
  useAuthStatus: () => useAuthStatusMock(),
}));

async function loadRoute() {
  return (await import("../routes/management")).Route as unknown as {
    __config: {
      component?: ComponentType;
    };
  };
}

describe("management route", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
    useAuthStatusMock.mockReset();
    searchMock = {};
    useQueryMock.mockReturnValue(undefined);
  });

  it("shows loading state while auth is unresolved", async () => {
    useAuthStatusMock.mockReturnValue({
      me: undefined,
      isLoading: true,
      isAuthenticated: false,
    });

    const route = await loadRoute();
    const Component = route.__config.component as ComponentType;
    render(<Component />);

    expect(screen.getByText("Loading management console…")).toBeTruthy();
    expect(screen.queryByText("Management only.")).toBeNull();
  });

  it("shows access denied for non-staff user", async () => {
    useAuthStatusMock.mockReturnValue({
      me: { _id: "users:1", role: "user" },
      isLoading: false,
      isAuthenticated: true,
    });

    const route = await loadRoute();
    const Component = route.__config.component as ComponentType;
    render(<Component />);

    expect(screen.getByText("Management only.")).toBeTruthy();
    expect(screen.queryByText("Loading management console…")).toBeNull();
  });

  it("renders console for moderator", async () => {
    useAuthStatusMock.mockReturnValue({
      me: { _id: "users:1", role: "moderator" },
      isLoading: false,
      isAuthenticated: true,
    });
    useQueryMock.mockImplementation((_fn: unknown, args: unknown) => {
      if (args === "skip") return undefined;
      if (typeof args === "object" && args !== null && "limit" in args) {
        return [];
      }
      return undefined;
    });

    const route = await loadRoute();
    const Component = route.__config.component as ComponentType;
    render(<Component />);

    expect(screen.getByText("Management console")).toBeTruthy();
    expect(screen.queryByText("Management only.")).toBeNull();
    expect(screen.queryByText("Loading management console…")).toBeNull();
  });
});
