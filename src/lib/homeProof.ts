import { formatCompactStat } from "./numberFormat";

/** Marketing floor for hero + proof bar; swap for live publisher count when available. */
export const HOME_PUBLISHER_COUNT = 200_000;
export const HOME_PUBLISHER_STAT = `${formatCompactStat(HOME_PUBLISHER_COUNT)}+`;

/** Design-time floors until public aggregate endpoints exist for these surfaces. */
export const HOME_PROOF_PLUGIN_FLOOR = 80;
export const HOME_PROOF_DOWNLOAD_FLOOR = 12_000_000;

export const HOME_PROOF_FEATURES = [
  {
    id: "discover",
    title: "One catalog, every surface",
    description:
      "Skills, plugins, and publishers share search, sort, and browse taxonomy — no hopping between silos.",
  },
  {
    id: "trust",
    title: "Trust before install",
    description:
      "Scan summaries, version history, and moderation state stay visible on the listing, not buried in a readme.",
  },
  {
    id: "ship",
    title: "Ship with OpenClaw",
    description:
      "Install with native commands, publish from the CLI, and keep agents on the same registry your gateway already knows.",
  },
] as const;

export const HOME_PROOF_PILLS = [
  { label: "Skills", to: "/skills" as const },
  { label: "Plugins", to: "/plugins" as const },
  { label: "Audits", to: "/audits" as const },
  {
    label: "Docs",
    href: "https://docs.openclaw.ai/clawhub",
  },
] as const;
