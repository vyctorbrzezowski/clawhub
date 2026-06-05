import type { PackageListItem } from "./packageApi";

/** Simple Icons slug + brand hex (no `#`). See https://simpleicons.org */
export type HomePluginBrand = {
  slug: string;
  color: string;
};

const BRANDS_BY_RUNTIME_ID: Record<string, HomePluginBrand> = {
  telegram: { slug: "telegram", color: "26A5E4" },
  whatsapp: { slug: "whatsapp", color: "25D366" },
  matrix: { slug: "matrix", color: "0DBD8B" },
  discord: { slug: "discord", color: "5865F2" },
  slack: { slug: "slack", color: "4A154B" },
  codex: { slug: "openai", color: "412991" },
  feishu: { slug: "bytedance", color: "3C8CFF" },
  "memory-lancedb": { slug: "milvus", color: "00A1EA" },
  brave: { slug: "brave", color: "FB542B" },
  acpx: { slug: "anthropic", color: "191919" },
  qqbot: { slug: "qq", color: "EB192D" },
  copilot: { slug: "githubcopilot", color: "000000" },
  msteams: { slug: "microsoftteams", color: "6264A7" },
  googlechat: { slug: "googlechat", color: "34A853" },
  "google-meet": { slug: "googlemeet", color: "00897B" },
  "nextcloud-talk": { slug: "nextcloud", color: "0082C9" },
  twitch: { slug: "twitch", color: "9146FF" },
  line: { slug: "line", color: "00C300" },
  "amazon-bedrock": { slug: "amazonwebservices", color: "FF9900" },
  "amazon-bedrock-mantle": { slug: "amazonwebservices", color: "FF9900" },
  openshell: { slug: "nvidia", color: "76B900" },
  "anthropic-vertex": { slug: "anthropic", color: "191919" },
  pixverse: { slug: "bytedance", color: "000000" },
  zalo: { slug: "zalo", color: "0068FF" },
  zalouser: { slug: "zalo", color: "0068FF" },
  diffs: { slug: "git", color: "F05032" },
  "diffs-language-pack": { slug: "git", color: "F05032" },
  "diagnostics-prometheus": { slug: "prometheus", color: "E6522C" },
  "diagnostics-otel": { slug: "opentelemetry", color: "000000" },
  "synology-chat": { slug: "synology", color: "B5B5B6" },
  tokenjuice: { slug: "ethereum", color: "3C3C3D" },
  "voice-call": { slug: "twilio", color: "F22F46" },
  bluebubbles: { slug: "apple", color: "000000" },
  "openclaw-kitchen-sink-fixture": { slug: "nodedotjs", color: "339933" },
  lobster: { slug: "nodedotjs", color: "339933" },
};

/** Home listing order — mirrors openclaw.ai/user/openclaw catalog emphasis. */
export const HOME_OPENCLAW_PLUGIN_ORDER: string[] = [
  "telegram",
  "whatsapp",
  "codex",
  "matrix",
  "discord",
  "feishu",
  "memory-lancedb",
  "brave",
  "openclaw-kitchen-sink-fixture",
  "acpx",
  "qqbot",
  "slack",
  "copilot",
  "msteams",
  "googlechat",
  "zalo",
  "zalouser",
  "openshell",
  "diffs",
  "nextcloud-talk",
  "twitch",
  "line",
  "google-meet",
  "amazon-bedrock",
  "amazon-bedrock-mantle",
  "anthropic-vertex",
  "pixverse",
  "nostr",
  "tlon",
  "bluebubbles",
  "voice-call",
  "lobster",
  "diagnostics-prometheus",
  "diagnostics-otel",
  "synology-chat",
  "tokenjuice",
  "diffs-language-pack",
];

export const OPENCLAW_PUBLISHER_HANDLE = "openclaw";

export function isOpenClawPublisherPlugin(plugin: PackageListItem) {
  return plugin.ownerHandle?.trim().toLowerCase() === OPENCLAW_PUBLISHER_HANDLE;
}

export function pluginRuntimeKey(plugin: PackageListItem) {
  if (plugin.runtimeId?.trim()) return plugin.runtimeId.trim();
  const scoped = plugin.name.match(/\/([^/]+)$/);
  return scoped?.[1] ?? plugin.name;
}

export function resolveHomePluginBrand(plugin: PackageListItem): HomePluginBrand | null {
  const key = pluginRuntimeKey(plugin);
  return BRANDS_BY_RUNTIME_ID[key] ?? null;
}

export function homePluginBrandIconUrl(brand: HomePluginBrand) {
  return `https://cdn.simpleicons.org/${encodeURIComponent(brand.slug)}/${brand.color}`;
}

export function sortHomeOpenClawPlugins(items: PackageListItem[]) {
  const order = new Map(HOME_OPENCLAW_PLUGIN_ORDER.map((id, index) => [id, index]));
  return [...items].sort((left, right) => {
    const leftKey = pluginRuntimeKey(left);
    const rightKey = pluginRuntimeKey(right);
    const leftOrder = order.get(leftKey) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = order.get(rightKey) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return (right.stats?.downloads ?? 0) - (left.stats?.downloads ?? 0);
  });
}

export function filterOpenClawOfficialPlugins(items: PackageListItem[]) {
  return items.filter((item) => item.isOfficial && isOpenClawPublisherPlugin(item));
}

type HomeOpenClawPluginDemoStats = {
  downloads: number;
  installs: number;
  stars: number;
  versions: number;
};

/** Prototype popularity for home officials when the catalog API has no stats yet. */
const HOME_OPENCLAW_PLUGIN_DEMO_STATS: Record<string, HomeOpenClawPluginDemoStats> = {
  telegram: { downloads: 2_840_000, installs: 412_000, stars: 186_000, versions: 48 },
  whatsapp: { downloads: 2_120_000, installs: 318_000, stars: 142_000, versions: 52 },
  codex: { downloads: 1_760_000, installs: 264_000, stars: 218_000, versions: 61 },
  discord: { downloads: 1_340_000, installs: 198_000, stars: 96_000, versions: 44 },
  matrix: { downloads: 890_000, installs: 124_000, stars: 68_000, versions: 39 },
  feishu: { downloads: 520_000, installs: 72_000, stars: 41_000, versions: 28 },
  slack: { downloads: 480_000, installs: 66_000, stars: 37_000, versions: 31 },
  "memory-lancedb": { downloads: 390_000, installs: 58_000, stars: 28_000, versions: 22 },
  brave: { downloads: 310_000, installs: 44_000, stars: 22_000, versions: 19 },
  msteams: { downloads: 270_000, installs: 38_000, stars: 19_000, versions: 24 },
  copilot: { downloads: 240_000, installs: 34_000, stars: 17_000, versions: 18 },
  acpx: { downloads: 180_000, installs: 26_000, stars: 14_000, versions: 16 },
  googlechat: { downloads: 165_000, installs: 23_000, stars: 12_000, versions: 15 },
  qqbot: { downloads: 95_000, installs: 14_000, stars: 8_200, versions: 12 },
  openshell: { downloads: 88_000, installs: 12_500, stars: 7_400, versions: 11 },
  zalo: { downloads: 76_000, installs: 11_000, stars: 6_100, versions: 10 },
  zalouser: { downloads: 71_000, installs: 9_800, stars: 5_600, versions: 9 },
  diffs: { downloads: 64_000, installs: 9_200, stars: 5_100, versions: 14 },
  "nextcloud-talk": { downloads: 58_000, installs: 8_400, stars: 4_700, versions: 13 },
  twitch: { downloads: 52_000, installs: 7_600, stars: 4_200, versions: 12 },
  line: { downloads: 47_000, installs: 6_900, stars: 3_800, versions: 11 },
  "google-meet": { downloads: 43_000, installs: 6_200, stars: 3_400, versions: 10 },
  "amazon-bedrock": { downloads: 39_000, installs: 5_700, stars: 3_100, versions: 17 },
  "amazon-bedrock-mantle": { downloads: 31_000, installs: 4_500, stars: 2_600, versions: 9 },
  "anthropic-vertex": { downloads: 28_000, installs: 4_100, stars: 2_300, versions: 14 },
  pixverse: { downloads: 22_000, installs: 3_200, stars: 1_900, versions: 8 },
  nostr: { downloads: 18_000, installs: 2_600, stars: 1_500, versions: 7 },
  tlon: { downloads: 15_000, installs: 2_200, stars: 1_200, versions: 6 },
  bluebubbles: { downloads: 41_000, installs: 5_900, stars: 3_200, versions: 11 },
  "voice-call": { downloads: 36_000, installs: 5_200, stars: 2_900, versions: 13 },
  lobster: { downloads: 12_000, installs: 1_700, stars: 980, versions: 5 },
  "diagnostics-prometheus": { downloads: 24_000, installs: 3_500, stars: 2_000, versions: 10 },
  "diagnostics-otel": { downloads: 21_000, installs: 3_100, stars: 1_750, versions: 9 },
  "synology-chat": { downloads: 19_000, installs: 2_800, stars: 1_600, versions: 8 },
  tokenjuice: { downloads: 9_800, installs: 1_400, stars: 820, versions: 6 },
  "diffs-language-pack": { downloads: 14_000, installs: 2_000, stars: 1_100, versions: 7 },
  "openclaw-kitchen-sink-fixture": { downloads: 4_200, installs: 620, stars: 340, versions: 3 },
};

const HOME_OPENCLAW_PLUGIN_META: Record<string, { displayName: string; summary: string }> = {
  telegram: {
    displayName: "Telegram",
    summary: "Bot API channel for Telegram chats and groups.",
  },
  whatsapp: {
    displayName: "WhatsApp",
    summary: "WhatsApp Web channel plugin for agent chats.",
  },
  matrix: { displayName: "Matrix", summary: "Rooms and direct messages on Matrix." },
  codex: { displayName: "Codex", summary: "Codex app-server harness and model provider." },
  discord: { displayName: "Discord", summary: "Channels, DMs, commands, and app events." },
  feishu: { displayName: "Feishu/Lark", summary: "Workplace chats and collaboration tools." },
  slack: { displayName: "Slack", summary: "Channels, DMs, commands, and app events." },
  msteams: { displayName: "Microsoft Teams", summary: "Meetings and team chat for agents." },
  brave: { displayName: "Brave Search", summary: "Brave Search provider for web lookup." },
  googlechat: {
    displayName: "Google Chat",
    summary: "Spaces and direct messages on Google Chat.",
  },
  "memory-lancedb": {
    displayName: "Memory (LanceDB)",
    summary: "Vector memory store backed by LanceDB.",
  },
  "google-meet": { displayName: "Google Meet", summary: "Meetings and calls on Google Meet." },
  "nextcloud-talk": {
    displayName: "Nextcloud Talk",
    summary: "Calls and chat through Nextcloud Talk.",
  },
  "amazon-bedrock": {
    displayName: "Amazon Bedrock",
    summary: "Models and inference via Amazon Bedrock.",
  },
  "amazon-bedrock-mantle": {
    displayName: "Amazon Bedrock Mantle",
    summary: "Bedrock Mantle model provider.",
  },
  "anthropic-vertex": {
    displayName: "Anthropic Vertex",
    summary: "Anthropic models on Google Vertex AI.",
  },
  "voice-call": { displayName: "Voice Call", summary: "Telephony and voice-call workflows." },
  bluebubbles: { displayName: "BlueBubbles", summary: "iMessage bridge via BlueBubbles." },
  "diagnostics-prometheus": {
    displayName: "Diagnostics (Prometheus)",
    summary: "Prometheus metrics for gateway diagnostics.",
  },
  "diagnostics-otel": {
    displayName: "Diagnostics (OpenTelemetry)",
    summary: "OpenTelemetry traces and metrics export.",
  },
  "synology-chat": {
    displayName: "Synology Chat",
    summary: "Team chat through Synology Chat.",
  },
  "diffs-language-pack": {
    displayName: "Diffs Language Pack",
    summary: "Language pack add-on for the Diffs plugin.",
  },
  "openclaw-kitchen-sink-fixture": {
    displayName: "Kitchen Sink Fixture",
    summary: "Internal fixture plugin for OpenClaw development.",
  },
};

function formatRuntimeDisplayName(runtimeId: string) {
  return runtimeId
    .split("-")
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

function homeOpenClawPluginDemoStats(runtimeId: string): HomeOpenClawPluginDemoStats {
  return (
    HOME_OPENCLAW_PLUGIN_DEMO_STATS[runtimeId] ?? {
      downloads: 8_400,
      installs: 1_200,
      stars: 720,
      versions: 4,
    }
  );
}

export function enrichHomeOpenClawPluginDemoStats(item: PackageListItem): PackageListItem {
  const runtimeId = pluginRuntimeKey(item);
  if ((item.stats?.downloads ?? 0) > 0) return item;
  const demo = homeOpenClawPluginDemoStats(runtimeId);
  return {
    ...item,
    stats: {
      versions: item.stats?.versions ?? demo.versions,
      installs: item.stats?.installs ?? demo.installs,
      downloads: demo.downloads,
      stars: demo.stars,
    },
  };
}

export function createHomeOpenClawPluginFallback(runtimeId: string): PackageListItem {
  const meta = HOME_OPENCLAW_PLUGIN_META[runtimeId];
  const demo = homeOpenClawPluginDemoStats(runtimeId);
  return {
    name: `@openclaw/${runtimeId}`,
    displayName: meta?.displayName ?? formatRuntimeDisplayName(runtimeId),
    runtimeId,
    family: "code-plugin",
    channel: "official",
    isOfficial: true,
    ownerHandle: OPENCLAW_PUBLISHER_HANDLE,
    summary: meta?.summary ?? "Official OpenClaw gateway plugin.",
    createdAt: 0,
    updatedAt: 0,
    stats: { ...demo },
  };
}

export const HOME_OPENCLAW_OFFICIAL_PLUGINS_FALLBACK: PackageListItem[] =
  HOME_OPENCLAW_PLUGIN_ORDER.map(createHomeOpenClawPluginFallback);

/** API rows win; missing catalog entries fall back to the hardcoded @openclaw list. */
export function mergeHomeOpenClawOfficialPlugins(apiItems: PackageListItem[]) {
  const apiByKey = new Map<string, PackageListItem>();
  for (const item of filterOpenClawOfficialPlugins(apiItems)) {
    apiByKey.set(pluginRuntimeKey(item), item);
  }
  const merged = HOME_OPENCLAW_PLUGIN_ORDER.map((runtimeId) => {
    const item = apiByKey.get(runtimeId) ?? createHomeOpenClawPluginFallback(runtimeId);
    return enrichHomeOpenClawPluginDemoStats(item);
  });
  return sortHomeOpenClawPlugins(merged);
}
