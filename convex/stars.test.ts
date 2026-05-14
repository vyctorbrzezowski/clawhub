/* @vitest-environment node */

import { getAuthUserId } from "@convex-dev/auth/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isStarred as isSoulStarred } from "./soulStars";
import { isStarred, listByUser } from "./stars";

vi.mock("@convex-dev/auth/server", () => ({
  getAuthUserId: vi.fn(),
}));

function unwrapHandler(wrapped: unknown) {
  const handler = (wrapped as { _handler?: unknown })._handler;
  if (typeof handler !== "function") {
    throw new Error("Expected Convex test wrapper to expose _handler");
  }
  return handler;
}

const isStarredHandler = unwrapHandler(isStarred) as (
  ctx: unknown,
  args: { skillId: string },
) => Promise<boolean>;
const isSoulStarredHandler = unwrapHandler(isSoulStarred) as (
  ctx: unknown,
  args: { soulId: string },
) => Promise<boolean>;
const listByUserHandler = unwrapHandler(listByUser) as (
  ctx: unknown,
  args: { userId: string; limit?: number },
) => Promise<unknown[]>;

function makeCtx(options: { user?: Record<string, unknown> | null; existingStar?: unknown }) {
  return {
    db: {
      get: vi.fn(async (id: string) => {
        if (id === "users:viewer") return options.user ?? { _id: "users:viewer" };
        return null;
      }),
      query: vi.fn(() => ({
        withIndex: vi.fn(() => ({
          unique: vi.fn().mockResolvedValue(options.existingStar ?? null),
        })),
      })),
    },
  };
}

beforeEach(() => {
  vi.mocked(getAuthUserId).mockReset();
});

describe("stars queries", () => {
  it("returns false instead of throwing when skill star auth is stale", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("users:viewer" as never);

    await expect(
      isStarredHandler(makeCtx({ user: null }), { skillId: "skills:demo" }),
    ).resolves.toBe(false);
  });

  it("returns false instead of throwing when soul star auth is stale", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("users:viewer" as never);

    await expect(
      isSoulStarredHandler(makeCtx({ user: null }), { soulId: "souls:demo" }),
    ).resolves.toBe(false);
  });

  it("still reports existing stars for active users", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("users:viewer" as never);

    await expect(
      isStarredHandler(makeCtx({ existingStar: { _id: "stars:demo" } }), {
        skillId: "skills:demo",
      }),
    ).resolves.toBe(true);
  });

  it("still reports existing soul stars for active users", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("users:viewer" as never);

    await expect(
      isSoulStarredHandler(makeCtx({ existingStar: { _id: "soulStars:demo" } }), {
        soulId: "souls:demo",
      }),
    ).resolves.toBe(true);
  });
});

function makeListByUserCtx(options: {
  stars?: Array<{
    _id: string;
    skillId: string;
    userId: string;
    _creationTime: number;
  }>;
  skills?: Record<string, Record<string, unknown> | null>;
}) {
  return {
    db: {
      get: vi.fn(async (id: string) => options.skills?.[id] ?? null),
      query: vi.fn(() => ({
        withIndex: vi.fn(() => ({
          order: vi.fn(() => ({
            take: vi.fn().mockResolvedValue(options.stars ?? []),
          })),
        })),
      })),
    },
  };
}

function makeSkill(id: string, overrides?: Record<string, unknown>) {
  return {
    _id: id,
    _creationTime: Date.now(),
    slug: `skill-${id.split(":").pop()}`,
    displayName: `Skill ${id}`,
    summary: "summary",
    icon: null,
    ownerUserId: "users:owner",
    ownerPublisherId: null,
    canonicalSkillId: null,
    forkOf: null,
    latestVersionId: null,
    tags: [],
    capabilityTags: [],
    badges: [],
    stats: {},
    statsDownloads: 0,
    statsStars: 0,
    statsInstallsCurrent: 0,
    statsInstallsAllTime: 0,
    softDeletedAt: null,
    moderationStatus: null,
    moderationFlags: null,
    moderationReason: null,
    isSuspicious: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe("listByUser", () => {
  it("returns public skills in order", async () => {
    const stars = [
      { _id: "stars:2", skillId: "skills:b", userId: "users:viewer", _creationTime: 2000 },
      { _id: "stars:1", skillId: "skills:a", userId: "users:viewer", _creationTime: 1000 },
    ];
    const skills = {
      "skills:a": makeSkill("skills:a"),
      "skills:b": makeSkill("skills:b"),
    };
    const result = await listByUserHandler(makeListByUserCtx({ stars, skills }), {
      userId: "users:viewer",
    });
    expect(result).toHaveLength(2);
    expect((result[0] as { slug: string }).slug).toBe("skill-b");
    expect((result[1] as { slug: string }).slug).toBe("skill-a");
  });

  it("filters out soft-deleted skills", async () => {
    const stars = [
      { _id: "stars:1", skillId: "skills:a", userId: "users:viewer", _creationTime: 1000 },
      { _id: "stars:2", skillId: "skills:b", userId: "users:viewer", _creationTime: 2000 },
    ];
    const skills = {
      "skills:a": makeSkill("skills:a", { softDeletedAt: 123 }),
      "skills:b": makeSkill("skills:b"),
    };
    const result = await listByUserHandler(makeListByUserCtx({ stars, skills }), {
      userId: "users:viewer",
    });
    expect(result).toHaveLength(1);
    expect((result[0] as { slug: string }).slug).toBe("skill-b");
  });

  it("preserves order with three stars", async () => {
    const stars = [
      { _id: "stars:3", skillId: "skills:c", userId: "users:viewer", _creationTime: 3000 },
      { _id: "stars:1", skillId: "skills:a", userId: "users:viewer", _creationTime: 1000 },
      { _id: "stars:2", skillId: "skills:b", userId: "users:viewer", _creationTime: 2000 },
    ];
    const skills = {
      "skills:a": makeSkill("skills:a"),
      "skills:b": makeSkill("skills:b"),
      "skills:c": makeSkill("skills:c"),
    };
    const result = await listByUserHandler(makeListByUserCtx({ stars, skills }), {
      userId: "users:viewer",
    });
    expect(result).toHaveLength(3);
    expect((result[0] as { slug: string }).slug).toBe("skill-c");
    expect((result[1] as { slug: string }).slug).toBe("skill-a");
    expect((result[2] as { slug: string }).slug).toBe("skill-b");
  });
});
