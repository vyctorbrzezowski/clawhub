import type { PackageListItem } from "./packageApi";

/** Simple Icons slug + brand hex (no `#`). See https://simpleicons.org */
export type HomePluginBrand = {
  slug: string;
  color: string;
};

const BRANDS_BY_RUNTIME_ID: Record<string, HomePluginBrand> = {
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
  "whatsapp",
  "matrix",
  "codex",
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

const HOME_OPENCLAW_PLUGIN_META: Record<string, { displayName: string; summary: string }> = {
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

export function createHomeOpenClawPluginFallback(runtimeId: string): PackageListItem {
  const meta = HOME_OPENCLAW_PLUGIN_META[runtimeId];
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
    stats: { downloads: 0, installs: 0, stars: 0, versions: 0 },
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
  const merged = HOME_OPENCLAW_PLUGIN_ORDER.map(
    (runtimeId) => apiByKey.get(runtimeId) ?? createHomeOpenClawPluginFallback(runtimeId),
  );
  return sortHomeOpenClawPlugins(merged);
}
