const SITE_ORIGIN = "https://clawhub.ai";
const DEFAULT_CONVEX_SITE_ORIGIN = "https://wry-manatee-359.convex.site";

export const HOME_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</api/v1/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs/api>; rel="service-doc"; type="text/html"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"; type="application/json"',
].join(", ");

export const HOME_MARKDOWN = `# ClawHub

ClawHub is a public registry for agent skills and OpenClaw plugins.

## Agent entry points

- Search the registry: ${SITE_ORIGIN}/search
- Browse skills: ${SITE_ORIGIN}/skills
- Browse plugins: ${SITE_ORIGIN}/plugins
- Public API documentation: ${SITE_ORIGIN}/docs/api
- OpenAPI description: ${SITE_ORIGIN}/api/v1/openapi.json
- API catalog: ${SITE_ORIGIN}/.well-known/api-catalog
- Agent skills index: ${SITE_ORIGIN}/.well-known/agent-skills/index.json

## API authentication

Public read endpoints do not require a token. Publishing, ownership, moderation,
and account workflows use ClawHub API tokens in the \`Authorization: Bearer clh_...\`
header. See ${SITE_ORIGIN}/docs/auth for CLI and token flows.
`;

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | JsonValue[];

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

export function jsonResponse(body: JsonValue, contentType = "application/json", status = 200) {
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    status,
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": contentType,
    },
  });
}

export function textResponse(body: string, contentType: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": contentType,
      "x-markdown-tokens": estimateMarkdownTokens(body),
    },
  });
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
            href: `${SITE_ORIGIN}/api/v1/skills?limit=1`,
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

export function getMcpServerCard() {
  const transport = {
    type: "streamable-http",
    endpoint: `${SITE_ORIGIN}/mcp`,
  };

  return {
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
  };
}

export function getMcpTools() {
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
