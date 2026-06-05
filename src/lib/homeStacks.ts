import { OPENCLAW_LOGO_URL } from "./nav-items";

/** Design-time curated stacks for the home discoverability prototype. */

const GITHUB_AVATAR_URL = "https://github.com";
const PETER_STEINBERGER_AVATAR_URL = `${GITHUB_AVATAR_URL}/steipete.png`;
const NVIDIA_AVATAR_URL = `${GITHUB_AVATAR_URL}/NVIDIA.png`;
const GARY_TAN_AVATAR_URL = `${GITHUB_AVATAR_URL}/garytan.png`;

export type HomeStackPreview = {
  title: string;
  meta: string;
  description: string;
  signals: string[];
};

/** User publishers render round avatars; orgs and thematic collections stay square. */
export type HomeStackAvatarKind = "user" | "org";

export type HomeStack = {
  id: string;
  title: string;
  description: string;
  avatarKind?: HomeStackAvatarKind;
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
    avatarKind: "user",
    publisherHandle: "steipete",
    logoUrl: PETER_STEINBERGER_AVATAR_URL,
    statsLabel: "24 skills",
    growthLabel: "+43%",
    growthDirection: "up",
  },
  {
    id: "nvidia",
    title: "NVIDIA",
    description: "GPU, inference, and agent tooling from NVIDIA publishers.",
    avatarKind: "org",
    publisherHandle: "nvidia",
    logoUrl: NVIDIA_AVATAR_URL,
    statsLabel: "18 skills",
    growthLabel: "+28%",
    growthDirection: "up",
  },
  {
    id: "gary-tan",
    title: "Gary Tan",
    description: "Startup ops, growth, and founder workflows.",
    avatarKind: "user",
    publisherHandle: "garytan",
    logoUrl: GARY_TAN_AVATAR_URL,
    statsLabel: "11 skills",
    growthLabel: "+19%",
    growthDirection: "up",
  },
  {
    id: "openclaw",
    title: "OpenClaw",
    description: "Official gateway, plugins, and reference agents.",
    avatarKind: "org",
    publisherHandle: "openclaw",
    logoUrl: OPENCLAW_LOGO_URL,
    statsLabel: "32 skills",
    growthLabel: "+12%",
    growthDirection: "up",
  },
  {
    id: "security",
    title: "Security essentials",
    description: "Auditing, secrets, and safe agent execution.",
    avatarKind: "org",
    browseQuery: "security",
    statsLabel: "46 skills",
    growthLabel: "+36%",
    growthDirection: "up",
  },
  {
    id: "coding-agents",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    avatarKind: "org",
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
    avatarKind: "user",
    publisherHandle: "steipete",
    logoUrl: PETER_STEINBERGER_AVATAR_URL,
    statsLabel: "24 skills",
    collectionTags: ["Publishing", "PR review", "Architecture"],
  },
  {
    id: "coll-nvidia",
    title: "NVIDIA AI",
    description: "Inference, speech, and GPU workflows from NVIDIA builders.",
    avatarKind: "org",
    publisherHandle: "nvidia",
    logoUrl: NVIDIA_AVATAR_URL,
    statsLabel: "18 skills",
    collectionTags: ["Inference", "CUDA", "Speech"],
  },
  {
    id: "coll-gary",
    title: "Gary Tan",
    description: "Startup ops, growth, and founder workflows.",
    avatarKind: "user",
    publisherHandle: "garytan",
    logoUrl: GARY_TAN_AVATAR_URL,
    statsLabel: "11 skills",
    collectionTags: ["Growth", "Fundraising", "Ops"],
  },
  {
    id: "coll-openclaw",
    title: "OpenClaw gateway",
    description: "Official gateway, plugins, and reference agents.",
    avatarKind: "org",
    publisherHandle: "openclaw",
    logoUrl: OPENCLAW_LOGO_URL,
    statsLabel: "32 skills",
    collectionTags: ["Gateway", "Plugins", "CLI"],
  },
  {
    id: "coll-security",
    avatarKind: "org",
    title: "Security essentials",
    description: "Auditing, secrets, and safe agent execution.",
    browseQuery: "security audit",
    statsLabel: "46 skills",
    collectionTags: ["Audit", "Secrets", "SBOM"],
  },
  {
    id: "coll-coding",
    avatarKind: "org",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    browseQuery: "coding agent",
    statsLabel: "58 skills",
    collectionTags: ["Code review", "CI", "Refactor"],
  },
  {
    id: "coll-automation",
    avatarKind: "org",
    title: "Automation workflows",
    description: "Cron, pipelines, and multi-step agent runs.",
    browseQuery: "automation workflow",
    statsLabel: "34 skills",
    collectionTags: ["Cron", "Pipelines", "Hooks"],
  },
  {
    id: "coll-devtools",
    avatarKind: "org",
    title: "Dev tools pack",
    description: "CLI helpers, scaffolding, and local dev ergonomics.",
    browseQuery: "dev tools",
    statsLabel: "41 skills",
    collectionTags: ["CLI", "Scaffold", "Lint"],
  },
  {
    id: "coll-data-apis",
    avatarKind: "org",
    title: "Data & APIs",
    description: "Fetch, integrate, and reconcile external services.",
    browseQuery: "api integration",
    statsLabel: "38 skills",
    collectionTags: ["REST", "Webhooks", "ETL"],
  },
  {
    id: "coll-research",
    avatarKind: "org",
    title: "Web & research",
    description: "Browse, scrape, and synthesize the open web.",
    browseQuery: "web research",
    statsLabel: "29 skills",
    collectionTags: ["Browse", "Scrape", "Summarize"],
  },
];

/** @deprecated Use {@link HOME_COLLECTION_STACKS}. */
export const HOME_EDITORIAL_STACKS = HOME_COLLECTION_STACKS;

/** Staff-curated collections shown beside the editor's pick hero (home spotlight). */
const HOME_STAFF_CURATED_STACK_IDS = [
  "coll-security",
  "coll-coding",
  "coll-automation",
  "coll-devtools",
  "coll-data-apis",
] as const;

export const HOME_STAFF_CURATED_STACKS: HomeStack[] = HOME_COLLECTION_STACKS.filter((stack) =>
  (HOME_STAFF_CURATED_STACK_IDS as readonly string[]).includes(stack.id),
);

/** Home collections chapter title (spotlight + discover). */
export const HOME_COLLECTIONS_HEADING = "Collections";

export const HOME_COLLECTIONS_LEDE = "Grouped by domain — pick what you're building.";

/** Hero banner eyebrow — playful, on-brand. */
export const HOME_FEATURED_STACK_EYEBROW = "Claws for your Claw 🦞";

/** Single spotlight collection rendered as the editorial hero banner. */
export const HOME_FEATURED_STACK: HomeStack = {
  id: "featured-essentials",
  title: "OpenClaw essentials",
  description:
    "The battle-tested starter pack — security, shipping, and architecture playbooks curated for production agents.",
  avatarKind: "org",
  publisherHandle: "openclaw",
  logoUrl: OPENCLAW_LOGO_URL,
  statsLabel: "30 skills · 12 plugins",
  growthLabel: "322k downloads · 18k installs this week",
  previews: [
    {
      title: "Skill Creator",
      meta: "Scaffold + publish",
      description:
        "Create a skill package, validate the shape, and publish with fewer manual steps.",
      signals: ["Templates", "Publish flow"],
    },
    {
      title: "Codereview",
      meta: "PR review agent",
      description:
        "Reads diffs like a release gate: regressions, missing tests, and merge blockers first.",
      signals: ["Risk scan", "Test gaps"],
    },
    {
      title: "Deepsec Audit",
      meta: "Security recon",
      description:
        "Maps exposed surfaces, trust boundaries, and exploit paths before the fix plan starts.",
      signals: ["Threat model", "Attack paths"],
    },
  ],
};

export function homeStackAvatarKind(stack: HomeStack): HomeStackAvatarKind {
  return stack.avatarKind ?? "org";
}

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
