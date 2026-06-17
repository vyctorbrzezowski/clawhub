# ClawHub UI Proof
Status: completed
Mode: `before-after`
Scenario: `.artifacts/proof-scenarios/social-card-installs.pw.ts`
Baseline: `upstream/main`
Candidate: `worktree`
Provider: `local-dev-server`

## Result
The skill social card renders the adoption metric as `Installs` in the candidate branch. The baseline image from `upstream/main` renders the same metric value as `Downloads`.

## Notes
The repo `proof:ui` runner could not start because the local `crabbox` binary was unavailable. These screenshots were captured from real local Vite dev servers for `upstream/main` and the candidate worktree using the same `/og/skill` request.
