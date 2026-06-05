import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function cssRule(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `Missing CSS rule for ${selector}`).toBeGreaterThanOrEqual(0);
  const end = css.indexOf("\n}", start);
  expect(end, `Unclosed CSS rule for ${selector}`).toBeGreaterThan(start);
  return css.slice(start, end + 2);
}

function cssMediaContaining(css: string, query: string, required: readonly string[]) {
  let start = css.indexOf(`@media ${query}`);
  while (start >= 0) {
    const nextMedia = css.indexOf("@media ", start + 1);
    const block = css.slice(start, nextMedia === -1 ? undefined : nextMedia);
    if (required.every((snippet) => block.includes(snippet))) return block;
    start = css.indexOf(`@media ${query}`, start + 1);
  }

  throw new Error(`Missing media query ${query} containing ${required.join(", ")}`);
}

function cssBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `Missing CSS block for ${selector}`).toBeGreaterThanOrEqual(0);
  const end = css.indexOf("\n}", start);
  expect(end, `Unclosed CSS block for ${selector}`).toBeGreaterThan(start);
  return css.slice(start, end + 2);
}

function tokenValue(css: string, selector: string, token: string) {
  const block = cssBlock(css, selector);
  const match = block.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})`));
  expect(match, `Missing ${token} in ${selector}`).toBeTruthy();
  return match![1];
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string) {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("restored UI design contract", () => {
  const header = () => read("src/components/Header.tsx");
  const footer = () => read("src/components/Footer.tsx");
  const home = () => read("src/routes/index.tsx");
  const homeListing = () => read("src/components/HomeListingSection.tsx");
  const navItems = () => read("src/lib/nav-items.ts");
  const settings = () => read("src/routes/settings.tsx");
  const styles = () => read("src/styles.css");
  const theme = () => read("src/lib/theme.ts");

  it("requires the restored two-row header, full-width search, public nav, and theme control", () => {
    const headerSource = header();
    const navSource = navItems();
    const css = styles();

    expect(headerSource).toContain("Row 1: Brand + Search + Actions");
    expect(headerSource).toContain('className="navbar-top"');
    expect(headerSource).toContain('className="navbar-search-wrap"');
    expect(headerSource).toContain('className="navbar-theme-switcher"');
    expect(headerSource).toContain('className="github-sign-in-button"');
    expect(headerSource).toContain('className="sign-in-full-copy"');
    expect(headerSource).toContain('className="sign-in-compact-copy"');
    expect(headerSource).toContain("Search skills and plugins");
    expect(headerSource).toContain("navbar-calm");
    expect(headerSource).toContain('className="navbar-calm-start"');
    expect(headerSource).toContain('className="navbar-calm-center"');
    expect(headerSource).toContain("navbar-calm-actions");
    expect(headerSource).toContain('className="navbar-calm-rail"');
    expect(headerSource).toContain("/og-clawhub-watermark.png");

    expect(navSource).toContain("export const SECONDARY_NAV_ITEMS");
    expect(navSource).toContain('label: "Publishers"');
    expect(navSource).toContain('label: "Docs"');
    expect(navSource).not.toContain('label: "About"');
    expect(navSource).not.toContain('label: "Stars"');
    expect(navSource).not.toContain('label: "Management"');

    const headerShell = cssRule(css, ".navbar-inner");
    expect(headerShell).toContain("max-width: var(--page-max)");
    expect(headerShell).toContain("padding: 0 var(--space-5)");

    const themeControl = cssRule(css, ".navbar-theme-switcher");
    expect(themeControl).toContain("--navbar-theme-outer-r: 10px");
    expect(themeControl).toContain("--navbar-theme-inner-r: calc(var(--navbar-theme-outer-r) - var(--navbar-theme-pad))");
    expect(themeControl).toContain("--navbar-theme-collapsed-w:");
    expect(themeControl).toContain("width: var(--navbar-theme-collapsed-w)");
    expect(css).toContain("--r-btn: var(--r-sm)");

    const compact = cssMediaContaining(css, "(max-width: 760px)", [
      "grid-template-columns: 40px minmax(0, 1fr) 40px",
      ".navbar-search {\n    display: flex;",
      ".navbar-tabs {\n    display: none;",
      ".nav-mobile {\n    display: inline-flex;",
    ]);
    expect(compact).not.toContain(".navbar-search {\n    display: none;");
  });

  it("requires the design home hero without catalog feed sections", () => {
    const homeSource = home();
    const css = styles();

    expect(homeSource).toContain("BUILT BY THE COMMUNITY");
    expect(homeSource).toContain("home-v2-sub-stat");
    expect(homeSource).toContain("HOME_PUBLISHER_STAT");
    expect(homeSource).toContain('to="/publishers"');
    expect(homeSource).toContain('className="home-v2-hero"');
    expect(homeSource).not.toContain("Trending Now");
    expect(homeSource).not.toContain("Featured skills");
    expect(homeSource).not.toContain("home-v2-proof-bar");
    expect(homeSource).toContain("HomeDiscoverSection");
    expect(homeSource).toContain("HomeListingSection");
    expect(homeListing()).toContain("home-v2-listing-controls");
    expect(homeListing()).toContain("home-v2-listing-toolbar");
    expect(homeListing()).toContain("home-v2-listing-sort");
    expect(homeListing()).toContain("HomeListingCategorySelect");
    expect(read("src/components/HomeListingCategorySelect.tsx")).toContain("BROWSE_TAXONOMY");
    expect(homeListing()).not.toContain("Other");
    expect(homeListing()).toContain("home-v2-listing-row");
    expect(styles()).toContain(".home-v2-listing-kind-btn.is-active");
    expect(styles()).toContain(".home-v2-listing-category-menu");
    expect(styles()).toContain(".home-v2-listing-category-panel");
    expect(homeSource).not.toContain("api.skills.listHighlightedPublic");
    expect(homeSource).not.toContain("home-v2-search-container");
    expect(homeSource).not.toContain("home-v2-suggestions");

    const searchShell = cssRule(css, ".home-v2-search-bar");
    expect(searchShell).toContain("border: 1px solid var(--hv2-border-strong)");
    expect(searchShell).not.toContain("border-color: var(--hv2-accent-border)");

    const searchFocus = cssRule(css, ".home-v2-search-bar:focus-within");
    expect(searchFocus).toContain("border-color: var(--hv2-accent-border)");

    expect(css).toContain(".app-shell:has(.home-v2-main) {");
    expect(css).toContain('[data-theme-resolved="light"] .app-shell:has(.home-v2-main),');
    expect(cssRule(css, ".app-shell:has(.home-v2-main) .home-v2-closing")).toContain(
      "background:",
    );
    expect(css).toContain(".home-v2-proof-stats");
    expect(css).toContain(".home-v2-faq-item");
  });

  it("requires the restored footer columns and mobile section toggles", () => {
    const footerSource = footer();
    const navSource = navItems();
    const css = styles();

    expect(navSource).toContain('title: "Browse"');
    expect(navSource).toContain('title: "Publish"');
    expect(navSource).toContain('title: "Community"');
    expect(navSource).toContain('title: "Ecosystem"');
    expect(navSource).toContain("OPENCLAW_ECOSYSTEM_URL");
    expect(navSource).toContain("FOOTER_ECOSYSTEM_TILES");
    expect(navSource).toContain('label: "Publish Skill"');
    expect(navSource).toContain('label: "Publish Plugin"');
    expect(navSource).toContain('label: "GitHub"');
    expect(navSource).toContain('label: "Overview"');
    expect(footerSource).toContain("site-footer-v2");
    expect(footerSource).toContain("footer-v2-eco-marks");
    expect(footerSource).toContain("Built alongside");
    expect(footerSource).not.toContain("footer-eco-band");
    expect(footerSource).not.toContain("footer-brand-illustration");
    expect(footerSource).toContain('className="footer-col-toggle"');
    expect(footerSource).toContain("const ariaExpanded = isMobile ? isOpen : true");
    expect(footerSource).toContain("aria-expanded={ariaExpanded}");
    expect(footerSource).toContain("data-open={isOpen}");
    expect(footerSource).toContain("toggleSection(section.title)");

    cssMediaContaining(css, "(max-width: 760px)", [
      ".footer-grid {\n    grid-template-columns: 1fr;",
      ".footer-col-links {\n    display: none;",
      '.footer-col-links[data-open="true"] {\n    display: flex;',
    ]);
  });

  it("prevents reintroducing tweakcn overlays, custom visual preferences, or density controls", () => {
    expect(existsSync(join(root, "src/lib/customTheme.ts"))).toBe(false);
    expect(existsSync(join(root, "src/lib/preferences.ts"))).toBe(false);

    const settingsSource = settings();
    expect(settingsSource).not.toMatch(/tweakcn|custom theme|overlay/i);
    expect(settingsSource).not.toMatch(/density|compact|relaxed|high contrast|code font size/i);
    expect(settingsSource).not.toMatch(/default view|experimental features/i);

    const themeSource = theme();
    expect(themeSource).toContain("cleanupLegacyVisualSettings");
    expect(themeSource).toContain("LEGACY_CUSTOM_THEME_KEY");
    expect(themeSource).toContain("LEGACY_PREFERENCES_KEY");
    expect(themeSource).toContain("DEFAULT_THEME_SELECTION");
    expect(themeSource).toContain("clearLegacyVisualCookies");
  });

  it("keeps runtime requirement text high contrast in both themes", () => {
    const css = styles();
    const installCardSource = read("src/components/SkillInstallCard.tsx");

    expect(installCardSource).toContain("runtime-requirements-panel");
    expect(cssRule(css, ".runtime-requirements-panel .stat")).toContain("color: var(--ink)");

    const darkRatio = contrastRatio(
      tokenValue(css, ":root", "--ink"),
      tokenValue(css, ":root", "--surface-muted"),
    );
    const lightRatio = contrastRatio(
      tokenValue(css, '[data-theme-family="claw"][data-theme-resolved="light"]', "--ink"),
      tokenValue(css, '[data-theme-family="claw"][data-theme-resolved="light"]', "--surface-muted"),
    );

    expect(darkRatio).toBeGreaterThanOrEqual(7);
    expect(lightRatio).toBeGreaterThanOrEqual(7);
  });

  it("keeps detail heroes full width unless an explicit sidebar is present", () => {
    const shellSource = read("src/components/DetailPageShell.tsx");
    const css = styles();

    expect(shellSource).toContain('"skill-hero-layout has-sidebar"');
    expect(cssRule(css, ".skill-hero-layout")).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(cssRule(css, ".skill-hero-lower.has-sidebar")).toContain(
      "grid-template-columns: minmax(0, 1fr) minmax(300px, 360px)",
    );
    expect(cssRule(css, ".skill-hero-main-extra")).toContain("overflow: hidden");
    expect(cssRule(css, ".skill-install-command-shell")).toContain("max-width: 100%");
    expect(cssRule(css, ".skill-hero-action-grid")).toContain(
      "grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
    );
  });
});
