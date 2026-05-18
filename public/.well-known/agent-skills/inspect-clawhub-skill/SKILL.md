# Inspect a ClawHub Skill

Use this skill when an agent needs metadata or source files for a specific public skill.

## Inputs

- `slug`: Skill slug.
- `path`: Optional file path, such as `SKILL.md`.
- `version`: Optional semantic version.
- `tag`: Optional version tag, such as `latest`.

## Procedure

1. Call `GET https://clawhub.ai/api/v1/skills/<slug>` for public metadata.
2. Call `GET https://clawhub.ai/api/v1/skills/<slug>/versions` when version history matters.
3. Call `GET https://clawhub.ai/api/v1/skills/<slug>/file?path=<path>` to read a public file.
4. Treat `404`, `410`, and moderation responses as authoritative availability boundaries.
5. Do not mirror hidden, private, or moderation-blocked content.

## Related Resources

- API docs: https://clawhub.ai/docs/api
- Auth docs: https://clawhub.ai/docs/auth
