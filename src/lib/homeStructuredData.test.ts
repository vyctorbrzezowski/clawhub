import { describe, expect, it } from "vitest";
import { getClawHubHomeStructuredData } from "./homeStructuredData";

describe("ClawHub homepage structured data", () => {
  it("publishes truthful entity, product, FAQ, and speakable schema", () => {
    const data = getClawHubHomeStructuredData();
    const graph = data["@graph"];

    expect(graph.some((node) => node["@type"] === "Organization")).toBe(true);
    expect(graph.some((node) => node["@type"] === "WebPage")).toBe(true);
    expect(graph.some((node) => node["@type"] === "SoftwareApplication")).toBe(true);
    expect(graph.some((node) => node["@type"] === "FAQPage")).toBe(true);
    expect(graph.some((node) => node["@type"] === "BreadcrumbList")).toBe(true);

    expect(JSON.stringify(data)).toContain("https://github.com/openclaw/clawhub");
    expect(JSON.stringify(data)).toContain("SpeakableSpecification");
    expect(JSON.stringify(data)).toContain("Public read endpoints do not require authentication");
  });
});
