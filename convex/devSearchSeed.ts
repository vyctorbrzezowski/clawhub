/**
 * Deterministic search/catalog seed fixtures.
 *
 * Provides stable, predictable skills and plugins for testing search paths:
 * exact slug match, prefix match, summary-only semantic recall, capability tag
 * filtering, suspicious exclusion, plugin-vs-skill catalog mix, and pagination
 * capping (26+ items).
 *
 * Run with:
 *   bunx convex run internal.devSearchSeed.seedSearchCatalogFixturesInternal
 * Or with reset:
 *   bunx convex run internal.devSearchSeed.seedSearchCatalogFixturesInternal '{"reset":true}'
 */

import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import { internalAction, internalMutation } from "./functions";
import { parseClawdisMetadata, parseFrontmatter } from "./lib/skills";

type SeedSkillSpec = {
  slug: string;
  displayName: string;
  summary: string;
  version: string;
  metadata: Record<string, unknown>;
  rawSkillMd: string;
  capabilityTags?: string[];
  isSuspicious?: boolean;
  stats?: {
    downloads: number;
    stars: number;
    installsCurrent: number;
    installsAllTime: number;
  };
};

type SeedPluginSpec = {
  name: string;
  displayName: string;
  summary: string;
  version: string;
  runtimeId: string;
  sourceRepo: string;
  isOfficial: boolean;
  capabilityTags: string[];
  stats: { downloads: number; installs: number; stars: number; versions: number };
  readme: string;
  family?: "skill" | "code-plugin" | "bundle-plugin";
};

function makeSkillSpec(
  slug: string,
  displayName: string,
  summary: string,
  opts: {
    capabilityTags?: string[];
    isSuspicious?: boolean;
    stats?: {
      downloads: number;
      stars: number;
      installsCurrent: number;
      installsAllTime: number;
    };
  } = {},
): SeedSkillSpec {
  const rawSkillMd = `---
name: ${slug}
description: ${summary}
---

# ${displayName}

## Usage

${summary}
`;
  return {
    slug,
    displayName,
    summary,
    version: "0.1.0",
    metadata: {
      clawdbot: {
        nix: {
          plugin: `github:example/${slug}`,
          systems: ["aarch64-darwin", "x86_64-linux"],
        },
        config: {
          requiredEnv: [],
        },
      },
    },
    rawSkillMd,
    capabilityTags: opts.capabilityTags,
    isSuspicious: opts.isSuspicious,
    stats: opts.stats,
  };
}

export function makeSearchCatalogFixtures(): {
  skills: SeedSkillSpec[];
  plugins: SeedPluginSpec[];
} {
  const skills: SeedSkillSpec[] = [
    // 1. Exact match
    makeSkillSpec(
      "search-exact-demo",
      "Search Exact Demo",
      "Seeded fixture for verifying exact slug and displayName matches.",
      { stats: { downloads: 100, stars: 10, installsCurrent: 5, installsAllTime: 20 } },
    ),

    // 5. Prefix match
    makeSkillSpec(
      "search-prefix-alpha",
      "Search Prefix Alpha",
      "Seeded fixture for verifying prefix matches on slug and displayName.",
      { stats: { downloads: 90, stars: 9, installsCurrent: 4, installsAllTime: 18 } },
    ),
    makeSkillSpec(
      "search-prefix-beta",
      "Search Prefix Beta",
      "Seeded fixture for verifying prefix matches on slug and displayName.",
      { stats: { downloads: 80, stars: 8, installsCurrent: 4, installsAllTime: 16 } },
    ),
    makeSkillSpec(
      "search-prefix-gamma",
      "Search Prefix Gamma",
      "Seeded fixture for verifying prefix matches on slug and displayName.",
      { stats: { downloads: 70, stars: 7, installsCurrent: 3, installsAllTime: 14 } },
    ),
    makeSkillSpec(
      "search-prefix-delta",
      "Search Prefix Delta",
      "Seeded fixture for verifying prefix matches on slug and displayName.",
      { stats: { downloads: 60, stars: 6, installsCurrent: 3, installsAllTime: 12 } },
    ),
    makeSkillSpec(
      "search-prefix-epsilon",
      "Search Prefix Epsilon",
      "Seeded fixture for verifying prefix matches on slug and displayName.",
      { stats: { downloads: 50, stars: 5, installsCurrent: 2, installsAllTime: 10 } },
    ),

    // 1. Summary-only match (semantic / lexical fallback via summary)
    // The unique word "giraffe" appears only in the summary, not in slug or displayName.
    makeSkillSpec(
      "search-semantic-zoo",
      "Semantic Zoo",
      "This fixture is designed to test summary-only recall via semantic search using the keyword giraffe.",
      { stats: { downloads: 40, stars: 4, installsCurrent: 2, installsAllTime: 8 } },
    ),

    // 5. Capability tag matches
    makeSkillSpec(
      "search-capability-database",
      "Capability Database",
      "Seeded fixture with database capability tags.",
      {
        capabilityTags: ["database", "sql"],
        stats: { downloads: 110, stars: 11, installsCurrent: 6, installsAllTime: 22 },
      },
    ),
    makeSkillSpec(
      "search-capability-ai",
      "Capability AI",
      "Seeded fixture with AI and ML capability tags.",
      {
        capabilityTags: ["ai", "ml"],
        stats: { downloads: 120, stars: 12, installsCurrent: 6, installsAllTime: 24 },
      },
    ),
    makeSkillSpec(
      "search-capability-webhook",
      "Capability Webhook",
      "Seeded fixture with webhook and HTTP capability tags.",
      {
        capabilityTags: ["webhook", "http"],
        stats: { downloads: 130, stars: 13, installsCurrent: 7, installsAllTime: 26 },
      },
    ),
    makeSkillSpec(
      "search-capability-crypto",
      "Capability Crypto",
      "Seeded fixture with crypto and wallet capability tags.",
      {
        capabilityTags: ["crypto", "wallet"],
        stats: { downloads: 140, stars: 14, installsCurrent: 7, installsAllTime: 28 },
      },
    ),
    makeSkillSpec(
      "search-capability-vision",
      "Capability Vision",
      "Seeded fixture with vision and image capability tags.",
      {
        capabilityTags: ["vision", "image"],
        stats: { downloads: 150, stars: 15, installsCurrent: 8, installsAllTime: 30 },
      },
    ),

    // 1. Suspicious fixture
    makeSkillSpec(
      "search-suspicious-mirror",
      "Suspicious Mirror",
      "Seeded fixture that is intentionally marked suspicious for filter testing.",
      {
        isSuspicious: true,
        stats: { downloads: 5, stars: 0, installsCurrent: 0, installsAllTime: 1 },
      },
    ),

    // Pagination fillers: 14 skills to reach 26 total skills.
    makeSkillSpec(
      "search-pagination-01",
      "Pagination One",
      "Seeded pagination filler fixture number one.",
      { stats: { downloads: 10, stars: 1, installsCurrent: 1, installsAllTime: 2 } },
    ),
    makeSkillSpec(
      "search-pagination-02",
      "Pagination Two",
      "Seeded pagination filler fixture number two.",
      { stats: { downloads: 11, stars: 1, installsCurrent: 1, installsAllTime: 2 } },
    ),
    makeSkillSpec(
      "search-pagination-03",
      "Pagination Three",
      "Seeded pagination filler fixture number three.",
      { stats: { downloads: 12, stars: 2, installsCurrent: 1, installsAllTime: 3 } },
    ),
    makeSkillSpec(
      "search-pagination-04",
      "Pagination Four",
      "Seeded pagination filler fixture number four.",
      { stats: { downloads: 13, stars: 2, installsCurrent: 1, installsAllTime: 3 } },
    ),
    makeSkillSpec(
      "search-pagination-05",
      "Pagination Five",
      "Seeded pagination filler fixture number five.",
      { stats: { downloads: 14, stars: 2, installsCurrent: 1, installsAllTime: 3 } },
    ),
    makeSkillSpec(
      "search-pagination-06",
      "Pagination Six",
      "Seeded pagination filler fixture number six.",
      { stats: { downloads: 15, stars: 3, installsCurrent: 1, installsAllTime: 4 } },
    ),
    makeSkillSpec(
      "search-pagination-07",
      "Pagination Seven",
      "Seeded pagination filler fixture number seven.",
      { stats: { downloads: 16, stars: 3, installsCurrent: 1, installsAllTime: 4 } },
    ),
    makeSkillSpec(
      "search-pagination-08",
      "Pagination Eight",
      "Seeded pagination filler fixture number eight.",
      { stats: { downloads: 17, stars: 3, installsCurrent: 2, installsAllTime: 4 } },
    ),
    makeSkillSpec(
      "search-pagination-09",
      "Pagination Nine",
      "Seeded pagination filler fixture number nine.",
      { stats: { downloads: 18, stars: 4, installsCurrent: 2, installsAllTime: 5 } },
    ),
    makeSkillSpec(
      "search-pagination-10",
      "Pagination Ten",
      "Seeded pagination filler fixture number ten.",
      { stats: { downloads: 19, stars: 4, installsCurrent: 2, installsAllTime: 5 } },
    ),
    makeSkillSpec(
      "search-pagination-11",
      "Pagination Eleven",
      "Seeded pagination filler fixture number eleven.",
      { stats: { downloads: 20, stars: 4, installsCurrent: 2, installsAllTime: 5 } },
    ),
    makeSkillSpec(
      "search-pagination-12",
      "Pagination Twelve",
      "Seeded pagination filler fixture number twelve.",
      { stats: { downloads: 21, stars: 5, installsCurrent: 2, installsAllTime: 6 } },
    ),
    makeSkillSpec(
      "search-pagination-13",
      "Pagination Thirteen",
      "Seeded pagination filler fixture number thirteen.",
      { stats: { downloads: 22, stars: 5, installsCurrent: 2, installsAllTime: 6 } },
    ),
    makeSkillSpec(
      "search-pagination-14",
      "Pagination Fourteen",
      "Seeded pagination filler fixture number fourteen.",
      { stats: { downloads: 23, stars: 5, installsCurrent: 2, installsAllTime: 6 } },
    ),
  ];

  const plugins: SeedPluginSpec[] = [
    {
      name: "search-plugin-runtime",
      displayName: "Search Plugin Runtime",
      summary: "Seeded runtime plugin for catalog search testing.",
      version: "1.0.0",
      runtimeId: "search.runtime",
      sourceRepo: "openclaw/search-plugin-runtime",
      isOfficial: false,
      capabilityTags: ["runtime", "execution"],
      stats: { downloads: 200, installs: 50, stars: 20, versions: 1 },
      readme: "# Search Plugin Runtime\n\nRuntime plugin fixture.",
      family: "code-plugin",
    },
    {
      name: "search-plugin-bundle",
      displayName: "Search Plugin Bundle",
      summary: "Seeded bundle plugin for catalog search testing.",
      version: "1.0.0",
      runtimeId: "search.bundle",
      sourceRepo: "openclaw/search-plugin-bundle",
      isOfficial: false,
      capabilityTags: ["bundle", "packaging"],
      stats: { downloads: 180, installs: 45, stars: 18, versions: 1 },
      readme: "# Search Plugin Bundle\n\nBundle plugin fixture.",
      family: "bundle-plugin",
    },
    {
      name: "search-plugin-official",
      displayName: "Search Plugin Official",
      summary: "Seeded official plugin for catalog search testing.",
      version: "1.0.0",
      runtimeId: "search.official",
      sourceRepo: "openclaw/search-plugin-official",
      isOfficial: true,
      capabilityTags: ["official", "verified"],
      stats: { downloads: 300, installs: 100, stars: 30, versions: 1 },
      readme: "# Search Plugin Official\n\nOfficial plugin fixture.",
      family: "code-plugin",
    },
    {
      name: "search-plugin-skill-family",
      displayName: "Search Plugin Skill Family",
      summary: "Seeded skill-family package for catalog search testing.",
      version: "1.0.0",
      runtimeId: "search.skill",
      sourceRepo: "openclaw/search-plugin-skill-family",
      isOfficial: false,
      capabilityTags: ["skill", "package"],
      stats: { downloads: 150, installs: 40, stars: 15, versions: 1 },
      readme: "# Search Plugin Skill Family\n\nSkill family package fixture.",
      family: "skill",
    },
    {
      name: "search-plugin-community",
      displayName: "Search Plugin Community",
      summary: "Seeded community plugin for catalog search testing.",
      version: "1.0.0",
      runtimeId: "search.community",
      sourceRepo: "openclaw/search-plugin-community",
      isOfficial: false,
      capabilityTags: ["community", "open-source"],
      stats: { downloads: 160, installs: 42, stars: 16, versions: 1 },
      readme: "# Search Plugin Community\n\nCommunity plugin fixture.",
      family: "code-plugin",
    },
  ];

  return { skills, plugins };
}

function injectMetadata(rawSkillMd: string, metadata: Record<string, unknown>) {
  const frontmatterEnd = rawSkillMd.indexOf("\n---", 3);
  if (frontmatterEnd === -1) return rawSkillMd;
  return `${rawSkillMd.slice(0, frontmatterEnd)}\nmetadata: ${JSON.stringify(
    metadata,
  )}${rawSkillMd.slice(frontmatterEnd)}`;
}

export const seedSearchCatalogFixturesInternal = internalAction({
  args: {
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx: ActionCtx, args) => {
    const { skills, plugins } = makeSearchCatalogFixtures();
    const results: Array<{ slug: string; ok: boolean; skipped?: boolean }> = [];

    // Seed skills
    for (const spec of skills) {
      const skillMd = injectMetadata(spec.rawSkillMd, spec.metadata);
      const frontmatter = parseFrontmatter(skillMd);
      const clawdis = parseClawdisMetadata(frontmatter);
      const storageId = await ctx.storage.store(new Blob([skillMd], { type: "text/markdown" }));

      const result = (await ctx.runMutation(internal.devSeed.seedSkillMutation, {
        reset: args.reset,
        storageId,
        metadata: spec.metadata,
        frontmatter,
        clawdis,
        skillMd,
        slug: spec.slug,
        displayName: spec.displayName,
        summary: spec.summary,
        version: spec.version,
      })) as { ok: boolean; skipped?: boolean; skillId?: string };

      // Apply deterministic stats and optional flags after creation
      if (result.skillId && !result.skipped) {
        const patch: Record<string, unknown> = {};
        if (spec.stats) {
          patch.statsDownloads = spec.stats.downloads;
          patch.statsStars = spec.stats.stars;
          patch.statsInstallsCurrent = spec.stats.installsCurrent;
          patch.statsInstallsAllTime = spec.stats.installsAllTime;
          patch.stats = {
            downloads: spec.stats.downloads,
            stars: spec.stats.stars,
            installsCurrent: spec.stats.installsCurrent,
            installsAllTime: spec.stats.installsAllTime,
            versions: 1,
            comments: 0,
          };
        }
        if (spec.isSuspicious) {
          patch.isSuspicious = true;
          patch.moderationFlags = ["flagged.suspicious"];
        }
        if (spec.capabilityTags) {
          patch.capabilityTags = spec.capabilityTags;
        }
        if (Object.keys(patch).length > 0) {
          await ctx.runMutation(internal.devSearchSeed.applySearchFixturePatch, {
            skillId: result.skillId as string,
            patch,
          });
        }
      }

      results.push({ slug: spec.slug, ok: result.ok, skipped: result.skipped });
    }

    // Seed plugins via the shared plugin package mutation
    const pluginStorageIds = await Promise.all(
      plugins.map((spec) => ctx.storage.store(new Blob([spec.readme], { type: "text/markdown" }))),
    );
    const pluginResult = (await ctx.runMutation(
      internal.devSeed.seedFeaturedPluginPackagesMutation,
      {
        reset: args.reset,
        packages: plugins.map((spec, index) => ({
          name: spec.name,
          displayName: spec.displayName,
          summary: spec.summary,
          version: spec.version,
          runtimeId: spec.runtimeId,
          sourceRepo: spec.sourceRepo,
          isOfficial: spec.isOfficial,
          capabilityTags: spec.capabilityTags,
          stats: spec.stats,
          storageId: pluginStorageIds[index],
          readmeSize: spec.readme.length,
        })),
      },
    )) as { ok: boolean; seeded?: string[]; skipped?: string[] };

    for (const name of pluginResult.seeded ?? []) {
      results.push({ slug: name, ok: true });
    }
    for (const name of pluginResult.skipped ?? []) {
      results.push({ slug: name, ok: true, skipped: true });
    }

    const created = results.filter((r) => !r.skipped).length;
    const skipped = results.filter((r) => r.skipped).length;

    return {
      ok: true,
      total: results.length,
      created,
      skipped,
      skillCount: skills.length,
      pluginCount: plugins.length,
    };
  },
});

export const applySearchFixturePatch = internalMutation({
  args: {
    skillId: v.id("skills"),
    patch: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.skillId, args.patch);
  },
});
