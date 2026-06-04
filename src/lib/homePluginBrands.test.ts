import { describe, expect, it } from "vitest";
import {
  filterOpenClawOfficialPlugins,
  homePluginBrandIconUrl,
  mergeHomeOpenClawOfficialPlugins,
  resolveHomePluginBrand,
  sortHomeOpenClawPlugins,
} from "./homePluginBrands";
import type { PackageListItem } from "./packageApi";

function plugin(overrides: Partial<PackageListItem> & Pick<PackageListItem, "name">): PackageListItem {
  return {
    displayName: overrides.name,
    family: "code-plugin",
    channel: "official",
    isOfficial: true,
    ownerHandle: "openclaw",
    createdAt: 1,
    updatedAt: 2,
    stats: { downloads: 0, installs: 0, stars: 0, versions: 1 },
    ...overrides,
  };
}

describe("homePluginBrands", () => {
  it("builds Simple Icons CDN URLs", () => {
    const brand = resolveHomePluginBrand(
      plugin({ name: "@openclaw/whatsapp", runtimeId: "whatsapp", displayName: "WhatsApp" }),
    );
    expect(brand).toEqual({ slug: "whatsapp", color: "25D366" });
    expect(homePluginBrandIconUrl(brand!)).toBe("https://cdn.simpleicons.org/whatsapp/25D366");
  });

  it("filters and sorts openclaw official plugins", () => {
    const items = [
      plugin({
        name: "@openclaw/discord",
        runtimeId: "discord",
        displayName: "Discord",
        stats: { downloads: 10, installs: 0, stars: 0, versions: 1 },
      }),
      plugin({
        name: "@openclaw/whatsapp",
        runtimeId: "whatsapp",
        displayName: "WhatsApp",
        stats: { downloads: 1, installs: 0, stars: 0, versions: 1 },
      }),
      plugin({
        name: "@other/demo",
        runtimeId: "demo",
        displayName: "Demo",
        ownerHandle: "other",
        isOfficial: true,
      }),
    ];

    const filtered = filterOpenClawOfficialPlugins(items);
    expect(filtered.map((item) => item.runtimeId)).toEqual(["discord", "whatsapp"]);

    const sorted = sortHomeOpenClawPlugins(filtered);
    expect(sorted.map((item) => item.runtimeId)).toEqual(["whatsapp", "discord"]);
  });

  it("merges API rows with hardcoded openclaw fallback", () => {
    const apiWhatsApp = plugin({
      name: "@openclaw/whatsapp",
      runtimeId: "whatsapp",
      displayName: "WhatsApp",
      stats: { downloads: 500, installs: 0, stars: 12, versions: 3 },
    });

    const merged = mergeHomeOpenClawOfficialPlugins([apiWhatsApp]);
    expect(merged[0]?.runtimeId).toBe("whatsapp");
    expect(merged[0]?.stats?.downloads).toBe(500);
    expect(merged.some((item) => item.runtimeId === "discord")).toBe(true);
    expect(merged.some((item) => item.runtimeId === "matrix")).toBe(true);
  });
});
