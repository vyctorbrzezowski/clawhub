import { OPENCLAW_LOGO_URL } from "./nav-items";

/** Design-time curated stacks for the home discoverability prototype. */

export type HomeStackPreview = {
  title: string;
  meta: string;
};

export type HomeStack = {
  id: string;
  title: string;
  description: string;
  /** Publisher profile route when the stack maps to a known builder/org. */
  publisherHandle?: string;
  /** Browse fallback when the stack is thematic rather than owner-scoped. */
  browseQuery?: string;
  statsLabel: string;
  growthLabel?: string;
  /** Momentum direction for growth label coloring. */
  growthDirection?: "up" | "down";
  /** Optional brand logo (e.g. publisher site favicon). */
  logoUrl?: string;
  /** Short topic chips shown on collection cards. */
  collectionTags?: string[];
  previews?: HomeStackPreview[];
};

export const HOME_TRENDING_STACKS: HomeStack[] = [
  {
    id: "peter-steinberger",
    title: "Peter Steinberger",
    description: "Core OpenClaw skills from the ecosystem architect.",
    publisherHandle: "steipete",
    statsLabel: "24 skills",
    growthLabel: "+43%",
    growthDirection: "up",
  },
  {
    id: "nvidia",
    title: "NVIDIA",
    description: "GPU, inference, and agent tooling from NVIDIA publishers.",
    publisherHandle: "nvidia",
    statsLabel: "18 skills",
    growthLabel: "+28%",
    growthDirection: "up",
  },
  {
    id: "gary-tan",
    title: "Gary Tan",
    description: "Startup ops, growth, and founder workflows.",
    publisherHandle: "garytan",
    statsLabel: "11 skills",
    growthLabel: "+19%",
    growthDirection: "up",
  },
  {
    id: "openclaw",
    title: "OpenClaw",
    description: "Official gateway, plugins, and reference agents.",
    publisherHandle: "openclaw",
    statsLabel: "32 skills",
    growthLabel: "+12%",
    growthDirection: "up",
  },
  {
    id: "security",
    title: "Security essentials",
    description: "Auditing, secrets, and safe agent execution.",
    browseQuery: "security",
    statsLabel: "46 skills",
    growthLabel: "+36%",
    growthDirection: "up",
  },
  {
    id: "coding-agents",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    browseQuery: "coding agent",
    statsLabel: "58 skills",
    growthLabel: "+51%",
    growthDirection: "up",
  },
];

/** Curated collections grid (compact cards; featured hero is separate). */
export const HOME_COLLECTION_STACKS: HomeStack[] = [
  {
    id: "coll-peter",
    title: "Peter Steinberger",
    description: "Production OpenClaw skills from the ecosystem architect.",
    publisherHandle: "steipete",
    statsLabel: "24 skills",
    collectionTags: ["Publishing", "PR review", "Architecture"],
  },
  {
    id: "coll-nvidia",
    title: "NVIDIA AI",
    description: "Inference, speech, and GPU workflows from NVIDIA builders.",
    publisherHandle: "nvidia",
    statsLabel: "18 skills",
    collectionTags: ["Inference", "CUDA", "Speech"],
  },
  {
    id: "coll-gary",
    title: "Gary Tan",
    description: "Startup ops, growth, and founder workflows.",
    publisherHandle: "garytan",
    statsLabel: "11 skills",
    collectionTags: ["Growth", "Fundraising", "Ops"],
  },
  {
    id: "coll-openclaw",
    title: "OpenClaw gateway",
    description: "Official gateway, plugins, and reference agents.",
    publisherHandle: "openclaw",
    logoUrl: OPENCLAW_LOGO_URL,
    statsLabel: "32 skills",
    collectionTags: ["Gateway", "Plugins", "CLI"],
  },
  {
    id: "coll-security",
    title: "Security essentials",
    description: "Auditing, secrets, and safe agent execution.",
    browseQuery: "security audit",
    statsLabel: "46 skills",
    collectionTags: ["Audit", "Secrets", "SBOM"],
  },
  {
    id: "coll-coding",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    browseQuery: "coding agent",
    statsLabel: "58 skills",
    collectionTags: ["Code review", "CI", "Refactor"],
  },
  {
    id: "coll-automation",
    title: "Automation workflows",
    description: "Cron, pipelines, and multi-step agent runs.",
    browseQuery: "automation workflow",
    statsLabel: "34 skills",
    collectionTags: ["Cron", "Pipelines", "Hooks"],
  },
  {
    id: "coll-devtools",
    title: "Dev tools pack",
    description: "CLI helpers, scaffolding, and local dev ergonomics.",
    browseQuery: "dev tools",
    statsLabel: "41 skills",
    collectionTags: ["CLI", "Scaffold", "Lint"],
  },
  {
    id: "coll-data-apis",
    title: "Data & APIs",
    description: "Fetch, integrate, and reconcile external services.",
    browseQuery: "api integration",
    statsLabel: "38 skills",
    collectionTags: ["REST", "Webhooks", "ETL"],
  },
  {
    id: "coll-research",
    title: "Web & research",
    description: "Browse, scrape, and synthesize the open web.",
    browseQuery: "web research",
    statsLabel: "29 skills",
    collectionTags: ["Browse", "Scrape", "Summarize"],
  },
];

/** @deprecated Use {@link HOME_COLLECTION_STACKS}. */
export const HOME_EDITORIAL_STACKS = HOME_COLLECTION_STACKS;

/** Single spotlight collection rendered as the editorial hero banner. */
export const HOME_FEATURED_STACK: HomeStack = {
  id: "featured-essentials",
  title: "OpenClaw essentials",
  description:
    "The battle-tested starter pack — security, shipping, and architecture playbooks curated for production agents.",
  publisherHandle: "openclaw",
  logoUrl: OPENCLAW_LOGO_URL,
  statsLabel: "322 installs this week",
  growthLabel: "+18%",
  growthDirection: "up",
  previews: [
    { title: "Skill Creator", meta: "Scaffold + publish" },
    { title: "Codereview", meta: "PR review agent" },
    { title: "Deepsec Audit", meta: "Security recon" },
  ],
};

export function getHomeStackHref(stack: HomeStack) {
  if (stack.publisherHandle) {
    return {
      to: "/user/$handle" as const,
      params: { handle: stack.publisherHandle },
    };
  }
  return {
    to: "/skills" as const,
    search: {
      q: stack.browseQuery,
      sort: "downloads" as const,
      dir: "desc" as const,
      highlighted: undefined,
      featured: undefined,
      category: undefined,
      view: undefined,
      focus: undefined,
    },
  };
}
