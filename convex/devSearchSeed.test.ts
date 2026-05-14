import { describe, expect, it } from "vitest";
import { makeSearchCatalogFixtures } from "./devSearchSeed";

describe("makeSearchCatalogFixtures", () => {
  it("returns deterministic fixture specs", () => {
    const first = makeSearchCatalogFixtures();
    const second = makeSearchCatalogFixtures();

    expect(first.skills).toEqual(second.skills);
    expect(first.plugins).toEqual(second.plugins);
  });

  it("produces at least 26 skills for pagination cap testing", () => {
    const { skills } = makeSearchCatalogFixtures();
    expect(skills.length).toBeGreaterThanOrEqual(26);
  });

  it("includes an exact-match slug", () => {
    const { skills } = makeSearchCatalogFixtures();
    expect(skills.some((s) => s.slug === "search-exact-demo")).toBe(true);
  });

  it("includes prefix-match slugs", () => {
    const { skills } = makeSearchCatalogFixtures();
    const prefixSlugs = skills.filter((s) => s.slug.startsWith("search-prefix-"));
    expect(prefixSlugs.length).toBeGreaterThanOrEqual(4);
  });

  it("includes a summary-only fixture with a unique keyword not in slug or displayName", () => {
    const { skills } = makeSearchCatalogFixtures();
    const summaryOnly = skills.find((s) => s.slug === "search-semantic-zoo");
    expect(summaryOnly).toBeDefined();
    expect(summaryOnly!.summary.toLowerCase()).toContain("giraffe");
    expect(summaryOnly!.slug.toLowerCase()).not.toContain("giraffe");
    expect(summaryOnly!.displayName.toLowerCase()).not.toContain("giraffe");
  });

  it("includes capability tag fixtures", () => {
    const { skills } = makeSearchCatalogFixtures();
    const tagged = skills.filter((s) => s.capabilityTags && s.capabilityTags.length > 0);
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(tagged.flatMap((s) => s.capabilityTags)).toContain("database");
    expect(tagged.flatMap((s) => s.capabilityTags)).toContain("ai");
  });

  it("includes a suspicious fixture", () => {
    const { skills } = makeSearchCatalogFixtures();
    const suspicious = skills.find((s) => s.isSuspicious);
    expect(suspicious).toBeDefined();
    expect(suspicious!.slug).toBe("search-suspicious-mirror");
  });

  it("includes deterministic stats", () => {
    const { skills } = makeSearchCatalogFixtures();
    const exact = skills.find((s) => s.slug === "search-exact-demo");
    expect(exact!.stats).toEqual({
      downloads: 100,
      stars: 10,
      installsCurrent: 5,
      installsAllTime: 20,
    });
  });

  it("includes plugin fixtures of varied families", () => {
    const { plugins } = makeSearchCatalogFixtures();
    expect(plugins.length).toBeGreaterThanOrEqual(4);
    expect(plugins.some((p) => p.family === "code-plugin")).toBe(true);
    expect(plugins.some((p) => p.family === "bundle-plugin")).toBe(true);
    expect(plugins.some((p) => p.family === "skill")).toBe(true);
  });

  it("includes an official and a non-official plugin", () => {
    const { plugins } = makeSearchCatalogFixtures();
    expect(plugins.some((p) => p.isOfficial)).toBe(true);
    expect(plugins.some((p) => !p.isOfficial)).toBe(true);
  });
});
