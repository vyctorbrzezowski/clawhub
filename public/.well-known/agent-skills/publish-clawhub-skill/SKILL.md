# Publish a ClawHub Skill

Use this skill when an authenticated agent needs to publish or update a ClawHub skill.

## Inputs

- `archive`: Skill archive containing `SKILL.md`.
- `token`: ClawHub API token with publish permission.

## Procedure

1. Validate the archive locally before upload.
2. Send `POST https://clawhub.ai/api/v1/skills` with `Authorization: Bearer clh_...`.
3. Prefer multipart upload for full skill archives.
4. Surface validation, license, moderation, and rate-limit errors directly to the operator.
5. Never publish on behalf of a user without their explicit approval for the exact archive.

## Related Resources

- Publishing docs: https://clawhub.ai/docs/publishing
- Auth docs: https://clawhub.ai/docs/auth
- OpenAPI: https://clawhub.ai/api/v1/openapi.json
