/**
 * Route Matrix Proof Example
 *
 * Playwright scenario compatible with `bun run proof:ui`.
 * Captures screenshots for a matrix of routes × viewports.
 *
 * Usage:
 *   bun run proof:ui -- --mode feature --scenario e2e/proofs/route-matrix.example.mjs
 *
 * Routes covered:
 *   - /           (home)
 *   - /skills     (skills browse)
 *   - /search?q=gif  (search with query)
 *   - /plugins    (plugins catalog)
 *
 * Viewports:
 *   - desktop: 1440×900
 *   - mobile:  390×844
 */

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const ROUTES = [
  { name: "Home", path: "/" },
  { name: "Skills Browse", path: "/skills" },
  { name: "Search Results", path: "/search?q=gif" },
  { name: "Plugins Catalog", path: "/plugins" },
];

export default async function routeMatrixProof({ baseURL, page, proof }) {
  for (const route of ROUTES) {
    const url = new URL(route.path, baseURL).href;

    await proof.step(`${route.name} — desktop ${DESKTOP.width}×${DESKTOP.height}`, async () => {
      await page.setViewportSize(DESKTOP);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForLoadState("networkidle");
    });

    await proof.step(`${route.name} — mobile ${MOBILE.width}×${MOBILE.height}`, async () => {
      await page.setViewportSize(MOBILE);
      // Re-navigate so responsive layouts re-render from scratch
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForLoadState("networkidle");
    });
  }
}
