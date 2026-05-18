const SITE_ORIGIN = "https://clawhub.ai";
const DEFAULT_CONVEX_SITE_ORIGIN = "https://wry-manatee-359.convex.site";

export const HOME_LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"',
  '</index.md>; rel="alternate"; type="text/markdown"',
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</api/v1/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs/api>; rel="service-doc"; type="text/html"',
  '</pricing.md>; rel="describedby"; type="text/markdown"',
  '</.well-known/agent.json>; rel="describedby"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp>; rel="service-meta"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"; type="application/json"',
].join(", ");

export const HOME_MARKDOWN = `# ClawHub

ClawHub is a public registry for agent skills and OpenClaw plugins. Agents use it to
find reusable skills, inspect plugin metadata, download public artifacts, and
publish packages with explicit ownership and moderation checks. Public read APIs are
available without authentication; write and publishing flows use ClawHub API tokens.

## Agent entry points

- Search the registry: ${SITE_ORIGIN}/search
- Browse skills: ${SITE_ORIGIN}/skills
- Browse plugins: ${SITE_ORIGIN}/plugins
- Agent view: ${SITE_ORIGIN}/?mode=agent
- Markdown homepage: ${SITE_ORIGIN}/index.md
- Pricing: ${SITE_ORIGIN}/pricing.md
- Public API documentation: ${SITE_ORIGIN}/docs/api
- OpenAPI description: ${SITE_ORIGIN}/api/v1/openapi.json
- API catalog: ${SITE_ORIGIN}/.well-known/api-catalog
- Agent discovery: ${SITE_ORIGIN}/.well-known/agent.json
- Agent skills index: ${SITE_ORIGIN}/.well-known/agent-skills/index.json
- MCP discovery: ${SITE_ORIGIN}/.well-known/mcp
- MCP server card: ${SITE_ORIGIN}/.well-known/mcp/server-card.json

## API authentication

Public read endpoints do not require a token. Publishing, ownership, moderation,
and account workflows use ClawHub API tokens in the \`Authorization: Bearer clh_...\`
header. See ${SITE_ORIGIN}/docs/auth for CLI and token flows.

## When agents should use ClawHub

Use ClawHub when a user asks to find, compare, inspect, install, or publish Codex-style
agent skills and OpenClaw plugins. Prefer the OpenAPI description for exact request
schemas, the API catalog for service discovery, and the agent skills index for static
machine-readable capability summaries.
`;

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type McpServerCard = JsonObject & {
  serverInfo: JsonObject;
  capabilities: JsonObject;
  tools: JsonObject[];
};

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: JsonValue;
  method?: string;
  params?: unknown;
};

function normalizeOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function getConvexSiteOrigin() {
  return (
    normalizeOrigin(process.env.VITE_CONVEX_SITE_URL) ??
    normalizeOrigin(process.env.CONVEX_SITE_URL) ??
    DEFAULT_CONVEX_SITE_ORIGIN
  );
}

export function prefersMarkdown(acceptHeader: string | null | undefined) {
  if (!acceptHeader) return false;
  return acceptHeader
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .some((part) => part === "text/markdown" || part.startsWith("text/markdown;"));
}

export function estimateMarkdownTokens(markdown: string) {
  const words = markdown.trim().match(/\S+/g);
  return String(words?.length ?? 0);
}

export function jsonResponse(
  body: JsonValue,
  contentType = "application/json",
  status = 200,
  headers?: HeadersInit,
) {
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    status,
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": contentType,
      ...headers,
    },
  });
}

export function textResponse(body: string, contentType: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": contentType,
      Vary: "Accept",
      "x-markdown-tokens": estimateMarkdownTokens(body),
    },
  });
}

export function getAgentModeView() {
  return {
    name: "ClawHub",
    url: SITE_ORIGIN,
    description:
      "Public registry for agent skills and OpenClaw plugins, with searchable metadata, artifact downloads, and token-authenticated publishing APIs.",
    when_to_use: [
      "Find agent skills or plugins by capability, keyword, category, or owner.",
      "Inspect a public skill or plugin before installing it.",
      "Download public skill files, plugin manifests, package artifacts, and OpenAPI metadata.",
      "Publish or manage owned skills and packages with a ClawHub API token.",
    ],
    endpoints: {
      homepage_markdown: `${SITE_ORIGIN}/index.md`,
      pricing_markdown: `${SITE_ORIGIN}/pricing.md`,
      api_docs: `${SITE_ORIGIN}/docs/api`,
      auth_docs: `${SITE_ORIGIN}/docs/auth`,
      openapi: `${SITE_ORIGIN}/api/v1/openapi.json`,
      api_catalog: `${SITE_ORIGIN}/.well-known/api-catalog`,
      agent_discovery: `${SITE_ORIGIN}/.well-known/agent.json`,
      agent_skills_index: `${SITE_ORIGIN}/.well-known/agent-skills/index.json`,
      mcp_discovery: `${SITE_ORIGIN}/.well-known/mcp`,
      mcp_transport: `${SITE_ORIGIN}/mcp`,
      mcp_server_card: `${SITE_ORIGIN}/.well-known/mcp/server-card.json`,
      oauth_authorization_server: `${SITE_ORIGIN}/.well-known/oauth-authorization-server`,
      oauth_protected_resource: `${SITE_ORIGIN}/.well-known/oauth-protected-resource`,
      status: `${SITE_ORIGIN}/status`,
      sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    },
    authentication: {
      public_read: "Public catalog read endpoints do not require authentication.",
      protected_write:
        "Publishing, ownership, moderation, and account workflows require Authorization: Bearer clh_... API tokens.",
      token_docs: `${SITE_ORIGIN}/docs/auth`,
      oauth_device_flow: `${SITE_ORIGIN}/api/cli/device/code`,
    },
    api: {
      version: "v1",
      base_url: `${SITE_ORIGIN}/api/v1`,
      openapi_url: `${SITE_ORIGIN}/api/v1/openapi.json`,
      rate_limit_headers: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
    },
    capabilities: [
      "skill_search",
      "skill_detail",
      "skill_file_download",
      "plugin_search",
      "plugin_detail",
      "package_artifact_download",
      "authenticated_publish",
    ],
  };
}

export function getApiCatalog() {
  return {
    linkset: [
      {
        anchor: `${SITE_ORIGIN}/api/v1`,
        "service-desc": [
          {
            href: `${SITE_ORIGIN}/api/v1/openapi.json`,
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_ORIGIN}/docs/api`,
            type: "text/html",
          },
          {
            href: `${SITE_ORIGIN}/docs/http-api`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${SITE_ORIGIN}/status`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}

export function getOAuthAuthorizationServer() {
  const convexIssuer = getConvexSiteOrigin();
  return {
    issuer: SITE_ORIGIN,
    authorization_endpoint: `${SITE_ORIGIN}/cli/auth`,
    token_endpoint: `${SITE_ORIGIN}/api/cli/device/token`,
    device_authorization_endpoint: `${SITE_ORIGIN}/api/cli/device/code`,
    jwks_uri: `${convexIssuer}/.well-known/jwks.json`,
    grant_types_supported: ["urn:ietf:params:oauth:grant-type:device_code"],
    response_types_supported: ["token"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["api:read", "api:write", "skills:publish", "packages:publish"],
    service_documentation: `${SITE_ORIGIN}/docs/auth`,
  };
}

export function getOAuthProtectedResource() {
  return {
    resource: `${SITE_ORIGIN}/api`,
    authorization_servers: [SITE_ORIGIN],
    scopes_supported: ["api:read", "api:write", "skills:publish", "packages:publish"],
    bearer_methods_supported: ["header"],
    resource_documentation: `${SITE_ORIGIN}/docs/api`,
  };
}

export function getMcpServerCard(): McpServerCard {
  const transport = {
    type: "streamable-http",
    endpoint: `${SITE_ORIGIN}/mcp`,
  };
  const tools = getMcpTools();

  return {
    name: "ClawHub",
    version: "1.0.0",
    serverUrl: `${SITE_ORIGIN}/mcp`,
    serverInfo: {
      name: "ClawHub",
      version: "1.0.0",
    },
    description: "Public ClawHub registry discovery for agent skills and OpenClaw plugins.",
    transport,
    transports: [transport],
    capabilities: {
      tools: {
        listChanged: false,
      },
      resources: {
        listChanged: false,
      },
      prompts: {
        listChanged: false,
      },
    },
    tools,
  };
}

export function getMcpTools(): JsonObject[] {
  return [
    {
      name: "search_clawhub",
      description: "Search public ClawHub skills and plugins.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query." },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
    {
      name: "inspect_clawhub_skill",
      description: "Fetch public metadata for a ClawHub skill by slug.",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Skill slug." },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
  ];
}

function jsonRpcResult(id: JsonValue | undefined, result: JsonValue) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    result,
  };
}

function jsonRpcError(id: JsonValue | undefined, code: number, message: string) {
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message },
  };
}

function handleSingleMcpRequest(request: JsonRpcRequest) {
  switch (request.method) {
    case "initialize":
      return jsonRpcResult(request.id, {
        protocolVersion: "2025-06-18",
        serverInfo: getMcpServerCard().serverInfo,
        capabilities: getMcpServerCard().capabilities,
      });
    case "ping":
      return jsonRpcResult(request.id, {});
    case "tools/list":
      return jsonRpcResult(request.id, { tools: getMcpTools() });
    case "resources/list":
      return jsonRpcResult(request.id, {
        resources: [
          {
            uri: `${SITE_ORIGIN}/.well-known/api-catalog`,
            name: "ClawHub API catalog",
            mimeType: "application/linkset+json",
          },
          {
            uri: `${SITE_ORIGIN}/api/v1/openapi.json`,
            name: "ClawHub OpenAPI description",
            mimeType: "application/vnd.oai.openapi+json",
          },
        ],
      });
    case "prompts/list":
      return jsonRpcResult(request.id, { prompts: [] });
    default:
      return jsonRpcError(request.id, -32601, "Method not found");
  }
}

export function handleMcpJsonRpc(body: unknown) {
  if (Array.isArray(body)) {
    return body.map((item) =>
      typeof item === "object" && item !== null
        ? handleSingleMcpRequest(item as JsonRpcRequest)
        : jsonRpcError(null, -32600, "Invalid Request"),
    );
  }

  if (typeof body !== "object" || body === null) {
    return jsonRpcError(null, -32600, "Invalid Request");
  }

  return handleSingleMcpRequest(body as JsonRpcRequest);
}
