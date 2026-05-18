/* @vitest-environment node */

import { afterEach, describe, expect, it } from "vitest";
import {
  estimateMarkdownTokens,
  getApiCatalog,
  getMcpServerCard,
  getOAuthAuthorizationServer,
  getOAuthProtectedResource,
  handleMcpJsonRpc,
  HOME_LINK_HEADER,
  HOME_MARKDOWN,
  prefersMarkdown,
} from "./agentReadiness";

describe("agent readiness helpers", () => {
  afterEach(() => {
    delete process.env.VITE_CONVEX_SITE_URL;
    delete process.env.CONVEX_SITE_URL;
  });

  it("advertises machine-readable resources from the homepage Link header", () => {
    expect(HOME_LINK_HEADER).toContain('rel="api-catalog"');
    expect(HOME_LINK_HEADER).toContain('rel="service-desc"');
    expect(HOME_LINK_HEADER).toContain('rel="service-doc"');
    expect(HOME_LINK_HEADER).toContain("/.well-known/agent-skills/index.json");
  });

  it("detects markdown content negotiation without taking over HTML requests", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/html, text/markdown;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/html,application/xhtml+xml")).toBe(false);
    expect(Number(estimateMarkdownTokens(HOME_MARKDOWN))).toBeGreaterThan(0);
  });

  it("builds an RFC 9727 linkset for the public API", () => {
    const catalog = getApiCatalog();
    expect(catalog.linkset[0]?.anchor).toBe("https://clawhub.ai/api/v1");
    expect(catalog.linkset[0]?.["service-desc"][0]?.href).toBe(
      "https://clawhub.ai/api/v1/openapi.json",
    );
  });

  it("describes API auth and protected resources without changing bearer-token semantics", () => {
    process.env.VITE_CONVEX_SITE_URL = "https://convex.example";

    expect(getOAuthAuthorizationServer()).toMatchObject({
      issuer: "https://clawhub.ai",
      device_authorization_endpoint: "https://clawhub.ai/api/cli/device/code",
      grant_types_supported: ["urn:ietf:params:oauth:grant-type:device_code"],
      jwks_uri: "https://convex.example/.well-known/jwks.json",
    });
    expect(getOAuthProtectedResource()).toMatchObject({
      resource: "https://clawhub.ai/api",
      authorization_servers: ["https://clawhub.ai"],
      bearer_methods_supported: ["header"],
    });
  });

  it("publishes MCP discovery and a minimal JSON-RPC capability surface", () => {
    expect(getMcpServerCard()).toMatchObject({
      serverInfo: { name: "ClawHub" },
      transport: { endpoint: "https://clawhub.ai/mcp" },
    });

    expect(handleMcpJsonRpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: { tools: [{ name: "search_clawhub" }] },
    });
  });
});
