# UI Proof

## Route Matrix Proof Example

The file `e2e/proofs/route-matrix.example.mjs` is a Playwright scenario that demonstrates how to capture screenshots across a matrix of routes and viewports without introducing a new framework.

### Covered routes

- `/` — Home
- `/skills` — Skills browse
- `/search?q=gif` — Search results with query
- `/plugins` — Plugins catalog

### Viewports

- Desktop: `1440×900`
- Mobile: `390×844`

### How to run

Feature proof (candidate only):

```bash
bun run proof:ui -- \
  --mode feature \
  --scenario e2e/proofs/route-matrix.example.mjs
```

Dry-run to verify the plan without starting a remote machine:

```bash
bun run proof:ui -- \
  --mode feature \
  --scenario e2e/proofs/route-matrix.example.mjs \
  --dry-run
```

### Artifacts

After a successful run, `proof-steps.json` and screenshots are written to the lane output directory under `.artifacts/clawhub-ui-proof/<timestamp>/candidate/`.

### Extending the matrix

To add a skill detail page, append a route entry using a slug known to exist in the target environment:

```js
ROUTES.push({ name: "Skill Detail", path: "/steipete/gifgrep" });
```

If the app supports a theme toggle, add a step that toggles the theme before capturing the screenshot and name the step accordingly (e.g., `Home — desktop — dark`).
