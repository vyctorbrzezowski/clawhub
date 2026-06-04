import { FEATURE_SOULS } from "./features";

/**
 * Shared navigation configuration used by Header and Footer to eliminate
 * triple duplication of nav link definitions.
 */

/** Lucide icon name used as a key to look up the component at render time. */
type NavIconName = "wrench" | "plug" | "ghost";

interface NavItemBase {
  /** Visible link text */
  label: string;
  /** Link only shown when user is authenticated */
  authRequired: boolean;
  /** Link only shown for staff / moderator users */
  staffOnly: boolean;
  /** Link only shown when siteMode === "souls" */
  soulModeOnly: boolean;
  /** Link hidden when siteMode === "souls" */
  soulModeHide: boolean;
  /** Additional path prefixes that should also highlight this nav item (e.g. /skill for /skills) */
  activePathPrefixes?: string[];
  /** Feature flag that must be truthy for this item to show */
  featureFlag?: boolean;
}

interface RouteNavItem extends NavItemBase {
  /** Route path passed to `<Link to>` */
  to: string;
  href?: never;
  /** Optional search params object passed to `<Link search>` */
  search?: Record<string, unknown>;
  /** Optional lucide icon name shown beside the label in navbar tabs */
  icon?: NavIconName;
}

interface ExternalNavItem extends NavItemBase {
  /** External URL rendered as a normal anchor */
  href: string;
  to?: never;
  search?: never;
  icon?: never;
}

type NavItem = RouteNavItem | ExternalNavItem;

// ---------------------------------------------------------------------------
// Search-param shapes (kept here so Header, Footer, and mobile menu all agree)
// ---------------------------------------------------------------------------

const SKILLS_SEARCH = {
  q: undefined,
  sort: undefined,
  dir: undefined,
  highlighted: undefined,
  view: undefined,
  focus: undefined,
} as const;

const SOULS_SEARCH = {
  q: undefined,
  sort: undefined,
  dir: undefined,
  view: undefined,
  focus: undefined,
} as const;

const PUBLISHERS_SEARCH = { q: undefined } as const;

// ---------------------------------------------------------------------------
// Primary nav items (desktop tabs row + mobile dropdown top section)
// These map to the "content-type" tabs: Skills | Plugins | Souls
// In soul-mode the order is: ClawHub (external), Souls
// In skills-mode: Skills, Plugins, Souls
// ---------------------------------------------------------------------------

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    label: "Skills",
    to: "/skills",
    search: SKILLS_SEARCH,
    icon: "wrench",
    authRequired: false,
    staffOnly: false,
    soulModeOnly: false,
    soulModeHide: true,
    activePathPrefixes: ["/skill/"],
  },
  {
    label: "Plugins",
    to: "/plugins",
    icon: "plug",
    authRequired: false,
    staffOnly: false,
    soulModeOnly: false,
    soulModeHide: false,
    activePathPrefixes: ["/plugin/"],
  },
  {
    label: "Souls",
    to: "/souls",
    search: SOULS_SEARCH,
    icon: "ghost",
    authRequired: false,
    staffOnly: false,
    soulModeOnly: false,
    soulModeHide: false,
    activePathPrefixes: ["/soul/"],
    featureFlag: FEATURE_SOULS,
  },
];

// ---------------------------------------------------------------------------
// Secondary nav items (desktop secondary tabs + mobile dropdown section)
// ---------------------------------------------------------------------------

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    label: "Publishers",
    to: "/publishers",
    search: PUBLISHERS_SEARCH,
    authRequired: false,
    staffOnly: false,
    soulModeOnly: false,
    soulModeHide: true,
  },
  {
    label: "Docs",
    href: "https://docs.openclaw.ai/clawhub/",
    authRequired: false,
    staffOnly: false,
    soulModeOnly: false,
    soulModeHide: true,
  },
];

// ---------------------------------------------------------------------------
// Footer sections
// ---------------------------------------------------------------------------

export const OPENCLAW_SITE_URL = "https://openclaw.ai";
export const OPENCLAW_ECOSYSTEM_URL = `${OPENCLAW_SITE_URL}/ecosystem`;
export const OPENCLAW_CLAWHUB_DOCS_URL = "https://docs.openclaw.ai/clawhub/";
/** Compact mark for stack avatars (not the full wordmark). */
export const OPENCLAW_LOGO_URL = `${OPENCLAW_SITE_URL}/favicon.svg`;

interface FooterNavSection {
  title: string;
  items: FooterNavItem[];
}

type FooterNavItem =
  | {
      kind: "link";
      label: string;
      to: string;
      search?: Record<string, unknown>;
      featureFlag?: boolean;
    }
  | { kind: "external"; label: string; href: string; featureFlag?: boolean }
  | { kind: "text"; label: string; featureFlag?: boolean };

export const FOOTER_NAV_SECTIONS: FooterNavSection[] = [
  {
    title: "Browse",
    items: [
      { kind: "link", label: "Skills", to: "/skills", search: SKILLS_SEARCH },
      { kind: "link", label: "Plugins", to: "/plugins" },
      { kind: "link", label: "Audits", to: "/audits", search: { type: undefined } },
      {
        kind: "link",
        label: "Souls",
        to: "/souls",
        search: SOULS_SEARCH,
        featureFlag: FEATURE_SOULS,
      },
    ],
  },
  {
    title: "Publish",
    items: [
      {
        kind: "link",
        label: "Publish Skill",
        to: "/skills/publish",
        search: { updateSlug: undefined },
      },
      {
        kind: "link",
        label: "Publish Plugin",
        to: "/plugins/publish",
        search: {
          ownerHandle: undefined,
          name: undefined,
          displayName: undefined,
          family: undefined,
          nextVersion: undefined,
          sourceRepo: undefined,
        },
      },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { kind: "external", label: "Overview", href: OPENCLAW_ECOSYSTEM_URL },
      { kind: "external", label: "OpenClaw", href: "https://openclaw.ai" },
      { kind: "external", label: "Docs", href: "https://docs.openclaw.ai/" },
    ],
  },
  {
    title: "Community",
    items: [
      { kind: "external", label: "GitHub", href: "https://github.com/openclaw/clawhub" },
      { kind: "external", label: "Discord", href: "https://discord.gg/clawd" },
    ],
  },
];

export const FOOTER_PLATFORM_LINKS = [
  { label: "Deployed on Vercel", href: "https://vercel.com" },
  { label: "Powered by Convex", href: "https://www.convex.dev" },
] as const;

export type FooterEcosystemProject = {
  label: string;
  href: string;
  blurb: string;
  /** Logo URL from https://openclaw.ai/ecosystem assets. */
  logoUrl: string;
  internal?: boolean;
};

/** @deprecated Use {@link FooterEcosystemProject}. */
export type FooterEcosystemTile = FooterEcosystemProject;

/** Build a URL for logos/banners published on the OpenClaw ecosystem page. */
export function openclawEcosystemAsset(path: string) {
  return `${OPENCLAW_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Curated highlights from https://openclaw.ai/ecosystem */
export const FOOTER_ECOSYSTEM_PROJECTS: FooterEcosystemProject[] = [
  {
    label: "ClawHub",
    href: "/",
    blurb: "Skills & plugins",
    logoUrl: openclawEcosystemAsset("/ecosystem/logos/clawhub.png"),
    internal: true,
  },
  {
    label: "Lobster",
    href: "https://docs.openclaw.ai/tools/lobster",
    blurb: "Workflow shell",
    logoUrl: openclawEcosystemAsset("/ecosystem/banners/lobster.png"),
  },
  {
    label: "Crabbox",
    href: "https://crabbox.sh",
    blurb: "Agent sandboxes",
    logoUrl: openclawEcosystemAsset("/ecosystem/logos/crabbox.svg"),
  },
  {
    label: "ClickClack",
    href: "https://clickclack.chat",
    blurb: "Chat for claws",
    logoUrl: openclawEcosystemAsset("/ecosystem/logos/clickclack.svg"),
  },
  {
    label: "Crabfleet",
    href: "https://crabfleet.ai",
    blurb: "Fleet control",
    logoUrl: openclawEcosystemAsset("/ecosystem/banners/crabfleet.png"),
  },
  {
    label: "Octopool",
    href: "https://octopool.dev",
    blurb: "GitHub relay",
    logoUrl: openclawEcosystemAsset("/ecosystem/logos/octopool.svg"),
  },
  {
    label: "ClawSweeper",
    href: "https://clawsweeper.bot",
    blurb: "Issue triage",
    logoUrl: openclawEcosystemAsset("/ecosystem/logos/clawsweeper.svg"),
  },
  {
    label: "agent-skills",
    href: "https://github.com/openclaw/agent-skills",
    blurb: "Shared skills",
    logoUrl: openclawEcosystemAsset("/ecosystem/banners/agent-skills.png"),
  },
];

/** @deprecated Use {@link FOOTER_ECOSYSTEM_PROJECTS}. */
export const FOOTER_ECOSYSTEM_TILES = FOOTER_ECOSYSTEM_PROJECTS;

/** @deprecated Use {@link FOOTER_ECOSYSTEM_PROJECTS}. */
export const FOOTER_ECOSYSTEM_PILLS = FOOTER_ECOSYSTEM_PROJECTS;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter a nav item array based on current mode/auth/staff context. */
export function filterNavItems(
  items: NavItem[],
  ctx: { isSoulMode: boolean; isAuthenticated: boolean; isStaff: boolean },
): NavItem[] {
  return items.filter((item) => {
    if (item.soulModeOnly && !ctx.isSoulMode) return false;
    if (item.soulModeHide && ctx.isSoulMode) return false;
    if (item.authRequired && !ctx.isAuthenticated) return false;
    if (item.staffOnly && !ctx.isStaff) return false;
    if (item.featureFlag === false) return false;
    return true;
  });
}
