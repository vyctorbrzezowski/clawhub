import { OPENCLAW_LOGO_URL } from "./nav-items";

/** Design-time curated stacks for the home discoverability prototype. */

const GITHUB_AVATAR_URL = "https://github.com";
const PETER_STEINBERGER_AVATAR_URL = `${GITHUB_AVATAR_URL}/steipete.png`;
const NVIDIA_AVATAR_URL = `${GITHUB_AVATAR_URL}/NVIDIA.png`;
const GARY_TAN_AVATAR_URL = `${GITHUB_AVATAR_URL}/garytan.png`;

function svgDataUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SECURITY_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 13l15 6v11c0 10.2-6.4 17.1-15 20.8-8.6-3.7-15-10.6-15-20.8V19l15-6z" fill="#2b2b2d" stroke="#b7b2ad" stroke-width="3"/><path d="M32 19l9 3.6v7.3c0 6.1-3.4 10.7-9 13.6V19z" fill="#8f8a84" opacity=".5"/></svg>',
);
const CODING_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M25 22L15 32l10 10" fill="none" stroke="#b7b2ad" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 22l10 10-10 10" fill="none" stroke="#8f8a84" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
);
const DATA_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="20" rx="14" ry="6" fill="#8f8a84"/><path d="M18 20v18c0 3.6 6.3 6.5 14 6.5S46 41.6 46 38V20" fill="none" stroke="#b7b2ad" stroke-width="4"/><path d="M18 29.5c0 3.6 6.3 6.5 14 6.5s14-2.9 14-6.5" fill="none" stroke="#74716d" stroke-width="3"/></svg>',
);
const AUTOMATION_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="22" cy="22" r="6" fill="#8f8a84"/><circle cx="42" cy="22" r="6" fill="#74716d"/><circle cx="32" cy="43" r="7" fill="#b7b2ad"/><path d="M28 22h8M25 28l5 8M39 28l-5 8" stroke="#2b2b2d" stroke-width="3.5" stroke-linecap="round" opacity=".8"/></svg>',
);
const DEVTOOLS_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="15" y="19" width="34" height="26" rx="7" fill="#202124" stroke="#b7b2ad" stroke-width="3"/><path d="M21 28h8M21 35h17" stroke="#8f8a84" stroke-width="3.5" stroke-linecap="round"/><circle cx="42" cy="28" r="3" fill="#74716d"/></svg>',
);
const OSS_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M20 24h24v18H20z" fill="#202124" stroke="#b7b2ad" stroke-width="3"/><path d="M24 19h16l4 5H20l4-5z" fill="#74716d"/><path d="M25 31h14M25 37h8" stroke="#8f8a84" stroke-width="3.5" stroke-linecap="round"/></svg>',
);
const INFERENCE_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M21 21h22v22H21z" fill="none" stroke="#b7b2ad" stroke-width="4.5"/><path d="M28 17v7M36 17v7M28 40v7M36 40v7M17 28h7M17 36h7M40 28h7M40 36h7" stroke="#74716d" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="32" r="5.5" fill="#8f8a84"/></svg>',
);
const VISION_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M14 32s7-13 18-13 18 13 18 13-7 13-18 13-18-13-18-13z" fill="none" stroke="#b7b2ad" stroke-width="4.5" stroke-linejoin="round"/><circle cx="32" cy="32" r="7" fill="#8f8a84"/><circle cx="32" cy="32" r="3" fill="#202124"/></svg>',
);
const SESSION_COLLECTION_ICON = svgDataUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M21 22h22v20H21z" fill="#202124" stroke="#b7b2ad" stroke-width="3.5"/><path d="M27 29h10M27 35h6" stroke="#8f8a84" stroke-width="3.5" stroke-linecap="round"/><circle cx="43" cy="42" r="7" fill="#74716d"/><path d="M43 38.5V42l3 3" stroke="#d0cbc4" stroke-width="2.8" stroke-linecap="round"/></svg>',
);

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
  /** Collection owner attribution shown as metadata. */
  ownerName?: string;
  ownerLogoUrl?: string;
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
    title: "OSS repo management",
    description: "Issues, PR review, release hygiene, and maintainer workflows.",
    avatarKind: "org",
    browseQuery: "open source repo management",
    logoUrl: OSS_COLLECTION_ICON,
    ownerName: "@steipete",
    ownerLogoUrl: PETER_STEINBERGER_AVATAR_URL,
    statsLabel: "24 skills",
    collectionTags: ["Issues", "PR review", "Releases"],
  },
  {
    id: "coll-nvidia",
    title: "Vision AI",
    description: "Image, video, perception, and visual inspection workflows.",
    avatarKind: "org",
    browseQuery: "vision ai computer vision",
    logoUrl: VISION_COLLECTION_ICON,
    ownerName: "@nvidia",
    ownerLogoUrl: NVIDIA_AVATAR_URL,
    statsLabel: "18 skills",
    collectionTags: ["Vision", "Video", "Inspection"],
  },
  {
    id: "coll-nvidia-agentic",
    title: "Agentic AI",
    description: "Autonomous planning, tool use, and agent runtime workflows.",
    avatarKind: "org",
    browseQuery: "agentic ai agents",
    logoUrl: INFERENCE_COLLECTION_ICON,
    ownerName: "@nvidia",
    ownerLogoUrl: NVIDIA_AVATAR_URL,
    statsLabel: "22 skills",
    collectionTags: ["Agents", "Tools", "Runtime"],
  },
  {
    id: "coll-gary",
    title: "Startup ops",
    description: "Fundraising, growth loops, hiring, and founder workflows.",
    avatarKind: "org",
    browseQuery: "startup ops growth founder",
    logoUrl: SESSION_COLLECTION_ICON,
    ownerName: "@garytan",
    ownerLogoUrl: GARY_TAN_AVATAR_URL,
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
    logoUrl: SECURITY_COLLECTION_ICON,
    statsLabel: "46 skills",
    collectionTags: ["Audit", "Secrets", "SBOM"],
  },
  {
    id: "coll-coding",
    avatarKind: "org",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    browseQuery: "coding agent",
    logoUrl: CODING_COLLECTION_ICON,
    statsLabel: "58 skills",
    collectionTags: ["Code review", "CI", "Refactor"],
  },
  {
    id: "coll-automation",
    avatarKind: "org",
    title: "Automation workflows",
    description: "Cron, pipelines, and multi-step agent runs.",
    browseQuery: "automation workflow",
    logoUrl: AUTOMATION_COLLECTION_ICON,
    statsLabel: "34 skills",
    collectionTags: ["Cron", "Pipelines", "Hooks"],
  },
  {
    id: "coll-devtools",
    avatarKind: "org",
    title: "Dev tools pack",
    description: "CLI helpers, scaffolding, and local dev ergonomics.",
    browseQuery: "dev tools",
    logoUrl: DEVTOOLS_COLLECTION_ICON,
    statsLabel: "41 skills",
    collectionTags: ["CLI", "Scaffold", "Lint"],
  },
  {
    id: "coll-data-apis",
    avatarKind: "org",
    title: "Data & APIs",
    description: "Fetch, integrate, and reconcile external services.",
    browseQuery: "api integration",
    logoUrl: DATA_COLLECTION_ICON,
    statsLabel: "38 skills",
    collectionTags: ["REST", "Webhooks", "ETL"],
  },
];

/** @deprecated Use {@link HOME_COLLECTION_STACKS}. */
export const HOME_EDITORIAL_STACKS = HOME_COLLECTION_STACKS;

/** Staff-curated collections shown beside the editor's pick hero (home spotlight). */
const HOME_STAFF_CURATED_STACK_IDS = [
  "coll-peter",
  "coll-nvidia",
  "coll-nvidia-agentic",
  "coll-gary",
  "coll-security",
  "coll-coding",
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
