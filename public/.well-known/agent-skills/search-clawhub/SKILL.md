# Search ClawHub

Use this skill when an agent needs to discover public ClawHub skills or plugins.

## Inputs

- `query`: Natural-language search text.
- `type`: Optional filter, either `skills` or `plugins`.

## Procedure

1. Call `GET https://clawhub.ai/api/v1/search?q=<query>` with `Accept: application/json`.
2. Prefer exact name and slug matches before broad tag matches.
3. Return canonical page URLs in the form `https://clawhub.ai/<owner>/<slug>` when an owner handle is available.
4. Link API detail URLs as `https://clawhub.ai/api/v1/skills/<slug>` when structured metadata is useful.
5. Respect rate-limit response headers and retry only after `Retry-After` when present.

## Related Resources

- API docs: https://clawhub.ai/docs/api
- OpenAPI: https://clawhub.ai/api/v1/openapi.json
