import { Link } from "@tanstack/react-router";
import { getHomeAppOrbitPlacement } from "../lib/homeAppOrbit";
import {
  HOME_PLUGIN_SHORTCUTS,
  HOME_SKILL_APPS,
  homeAppIconUrl,
  homePluginShortcutIconUrl,
  SKILLS_BROWSE_SEARCH,
} from "../lib/homeApps";

function HomeSkillAppPill({
  app,
  index,
}: {
  app: (typeof HOME_SKILL_APPS)[number];
  index: number;
}) {
  const slot = getHomeAppOrbitPlacement("left", index);

  return (
    <Link
      to="/skills"
      search={{ ...SKILLS_BROWSE_SEARCH, q: app.browseQuery }}
      className="home-v2-app-pill home-v2-app-pill--skill"
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.zIndex,
        opacity: slot.opacity,
        ["--pill-scale" as string]: slot.scale,
        transform: "translate(-50%, -50%) scale(var(--pill-scale))",
      }}
      title={app.description}
      aria-label={`${app.name} skill — ${app.description} (${app.skillsLabel})`}
    >
      <span className="home-v2-app-pill-icon" aria-hidden="true">
        <img
          src={homeAppIconUrl(app.iconDomain)}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-app-pill-name">{app.name}</span>
    </Link>
  );
}

function HomePluginAppPill({
  plugin,
  index,
}: {
  plugin: (typeof HOME_PLUGIN_SHORTCUTS)[number];
  index: number;
}) {
  const slot = getHomeAppOrbitPlacement("right", index);

  return (
    <Link
      to="/plugins/$name"
      params={{ name: plugin.packageName }}
      className="home-v2-app-pill home-v2-app-pill--plugin"
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.zIndex,
        opacity: slot.opacity,
        ["--pill-scale" as string]: slot.scale,
        transform: "translate(-50%, -50%) scale(var(--pill-scale))",
      }}
      title={plugin.description}
      aria-label={`${plugin.name} plugin — ${plugin.description} (Official)`}
    >
      <span className="home-v2-app-pill-icon" aria-hidden="true">
        <img
          src={homePluginShortcutIconUrl(plugin)}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-app-pill-name">{plugin.name}</span>
    </Link>
  );
}

export function HomeAppsSection() {
  return (
    <section className="home-v2-apps" aria-labelledby="home-v2-apps-title">
      <div className="home-v2-apps-header">
        <div className="home-v2-apps-heading">
          <p className="home-v2-apps-eyebrow">Shortcuts</p>
          <h2 id="home-v2-apps-title" className="home-v2-apps-title">
            Skills for your apps
          </h2>
          <p className="home-v2-apps-lede">
            Skills for the tools you run on the left; official OpenClaw gateway plugins on the
            right. Each pill opens a focused browse path.
          </p>
        </div>
      </div>

      <div className="home-v2-apps-stage">
        <div className="home-v2-apps-stage-vignette" aria-hidden="true" />
        <div className="home-v2-apps-stage-fade home-v2-apps-stage-fade--left" aria-hidden="true" />
        <div className="home-v2-apps-stage-fade home-v2-apps-stage-fade--right" aria-hidden="true" />

        <div className="home-v2-apps-orbit" role="group" aria-label="Skills and plugin shortcuts">
          <div className="home-v2-apps-orbit-guides" aria-hidden="true">
            <span className="home-v2-apps-orbit-arc home-v2-apps-orbit-arc--left" />
            <span className="home-v2-apps-orbit-arc home-v2-apps-orbit-arc--right" />
          </div>

          <span className="home-v2-apps-orbit-cap home-v2-apps-orbit-cap--left">Skills</span>
          <span className="home-v2-apps-orbit-cap home-v2-apps-orbit-cap--right">Plugins</span>

          <div className="home-v2-apps-hub" aria-hidden="true">
            <span className="home-v2-apps-hub-ring" />
            <span className="home-v2-apps-hub-core">
              <img
                src="/og-clawhub-watermark.png"
                alt=""
                width={28}
                height={28}
                decoding="async"
              />
            </span>
          </div>

          {HOME_SKILL_APPS.map((app, index) => (
            <HomeSkillAppPill key={app.id} app={app} index={index} />
          ))}
          {HOME_PLUGIN_SHORTCUTS.map((plugin, index) => (
            <HomePluginAppPill key={plugin.id} plugin={plugin} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
