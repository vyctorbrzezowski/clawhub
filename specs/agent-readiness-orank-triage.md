# Agent Readiness Orank Triage

This note records which orank findings are safe to fix in code and which must not be faked for score chasing.

## High-confidence code fixes

These are truthful, machine-checkable improvements and can be maintained in this repo:

- Sitemap and robots discovery: `sitemap.xml`, `robots.txt`, Content Signals, and crawler-specific allow/deny groups.
- HTTP discovery headers: homepage `Link` headers for sitemap, markdown alternate, OpenAPI, API catalog, agent discovery, MCP discovery, and OAuth protected-resource metadata.
- Markdown access: `Accept: text/markdown` on `/` plus `/index.md`, with `Vary: Accept`.
- Structured identity: homepage JSON-LD for Organization, WebSite, WebPage, SoftwareApplication, FAQPage, BreadcrumbList, and speakable selectors.
- Agent discovery: `/.well-known/agent.json`, `/.well-known/agent-card.json`, `/.well-known/agent-skills/index.json`, and concise `llms.txt` files.
- API discovery: `/.well-known/api-catalog`, OpenAPI operation IDs, `/status`, and `/api/llms.txt`.
- MCP discovery: `/.well-known/mcp`, `/.well-known/mcp/server-card.json`, and GET `/mcp` discovery alongside POST JSON-RPC.

## Worth doing, but not as this PR

These are real improvements, but they need product, ecosystem, or API-contract work:

- Structured JSON errors across API v1. This is worth doing, but the current API and tests rely on text error bodies in many places. Treat it as a separate compatibility PR.
- Idempotency keys, batch endpoints, async job APIs, NLWeb `/ask`, streaming, MCP Apps, and A2UI. Implement only when ClawHub has real product semantics for them.
- Webhook signature verification. Do this only if ClawHub exposes customer webhooks; do not document verification for unrelated internal or outbound webhook code.
- Comparison pages, category content, case studies, and developer tutorials. These are marketing/docs investments and should make specific, supportable claims.
- skills.sh or ChatGPT/Claude/Gemini listings. These are external publication workflows, not repo-only code changes.
- `pricing.md`. ClawHub is an OSS registry, not a priced SaaS surface; do not add a fake pricing document just to satisfy a scanner. Keep the no-paid-skills invariant in product docs and agent context instead.

## Do not fake

These findings should not be resolved by code claims alone:

- Wikipedia or Wikidata presence. Create these only after independent third-party coverage establishes notability.
- Knowledge-cutoff coverage. This improves through public adoption, press, docs, and time, not by adding local files.
- Organization address, phone, aggregate ratings, customer reviews, or verification badges. Add only verified facts.
- Competitor claims or "unlike X" positioning without confirmed product comparisons and owner approval.
- Any claim that ClawHub is a multi-channel Discord/Slack/Teams gateway. The current product is a registry/API for skills and OpenClaw plugins.
