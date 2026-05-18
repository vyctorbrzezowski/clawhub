/* @vitest-environment node */

import { afterEach, describe, expect, it } from "vitest";
import {
  estimateMarkdownTokens,
  getAgentModeView,
  getApiCatalog,
  getMcpServerCard,
  getOAuthAuthorizationServer,
  getOAuthProtectedResource,
  handleMcpJsonRpc,
  HOME_LINK_HEADER,
  HOME_MARKDOWN,
  prefersMarkdown,
  textResponse,
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
    expect(HOME_LINK_HEADER).toContain("/sitemap.xml");
    expect(HOME_LINK_HEADER).toContain("/index.md");
    expect(HOME_LINK_HEADER).toContain("/.well-known/agent.json");
    expect(HOME_LINK_HEADER).toContain("/.well-known/mcp");
    expect(HOME_LINK_HEADER).toContain("/.well-known/agent-skills/index.json");
  });

  it("detects markdown content negotiation without taking over HTML requests", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/html, text/markdown;q=0.9")).toBe(true);
    expect(prefersMarkdown("text/html,application/xhtml+xml")).toBe(false);
    expect(Number(estimateMarkdownTokens(HOME_MARKDOWN))).toBeGreaterThan(0);
    const response = textResponse(HOME_MARKDOWN, "text/markdown; charset=utf-8");
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(response.headers.get("Content-Type")).toContain("text/markdown");
  });

  it("builds a machine-readable agent mode view for the homepage", () => {
    expect(getAgentModeView()).toMatchObject({
      name: "ClawHub",
      endpoints: {
        openapi: "https://clawhub.ai/api/v1/openapi.json",
        agent_discovery: "https://clawhub.ai/.well-known/agent.json",
        mcp_discovery: "https://clawhub.ai/.well-known/mcp",
      },
      authentication: {
        public_read: "Public catalog read endpoints do not require authentication.",
      },
      api: {
        version: "v1",
      },
    });
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
      name: "ClawHub",
      serverUrl: "https://clawhub.ai/mcp",
      serverInfo: { name: "ClawHub" },
      transport: { endpoint: "https://clawhub.ai/mcp" },
      tools: [{ name: "search_clawhub" }, { name: "inspect_clawhub_skill" }],
    });

    expect(handleMcpJsonRpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: { tools: [{ name: "search_clawhub" }, { name: "inspect_clawhub_skill" }] },
    });
  });
});
