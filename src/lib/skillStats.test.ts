import { describe, expect, it } from "vitest";
import { readCanonicalStars } from "./skillStats";

describe("readCanonicalStars", () => {
  it("prefers top-level statsStars over nested stats.stars", () => {
    expect(
      readCanonicalStars({
        statsStars: 100,
        stats: { stars: 0 },
      }),
    ).toBe(100);
  });

  it("falls back to stats.stars when statsStars is undefined", () => {
    expect(
      readCanonicalStars({
        stats: { stars: 42 },
      }),
    ).toBe(42);
  });

  it("returns 0 when both fields are missing", () => {
    expect(readCanonicalStars({})).toBe(0);
  });

  it("returns 0 when stats is null", () => {
    expect(readCanonicalStars({ stats: null })).toBe(0);
  });

  it("handles statsStars of 0 correctly", () => {
    expect(
      readCanonicalStars({
        statsStars: 0,
        stats: { stars: 10 },
      }),
    ).toBe(0);
  });
});
