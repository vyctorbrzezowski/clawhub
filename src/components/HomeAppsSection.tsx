import { Link } from "@tanstack/react-router";
import {
  HOME_PLUGIN_SHORTCUTS,
  HOME_SKILL_APPS,
  homeAppIconUrl,
  homePluginShortcutIconUrl,
  SKILLS_BROWSE_SEARCH,
  type HomePluginShortcut,
  type HomeSkillApp,
} from "../lib/homeApps";

function HomeSkillAppCard({ app }: { app: HomeSkillApp }) {
  return (
    <Link
      to="/skills"
      search={{ ...SKILLS_BROWSE_SEARCH, q: app.browseQuery }}
      className="home-v2-app-shortcut home-v2-app-shortcut--skill"
      title={app.description}
      aria-label={`${app.name} skill — ${app.description} (${app.skillsLabel})`}
    >
      <span className="home-v2-app-shortcut-icon" aria-hidden="true">
        <img
          src={homeAppIconUrl(app.iconDomain)}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-app-shortcut-copy">
        <span className="home-v2-app-shortcut-name">{app.name}</span>
        <span className="home-v2-app-shortcut-meta">{app.skillsLabel}</span>
      </span>
    </Link>
  );
}

function HomePluginAppCard({ plugin }: { plugin: HomePluginShortcut }) {
  return (
    <Link
      to="/plugins/$name"
      params={{ name: plugin.packageName }}
      className="home-v2-app-shortcut home-v2-app-shortcut--plugin"
      title={plugin.description}
      aria-label={`${plugin.name} plugin — ${plugin.description} (Official)`}
    >
      <span className="home-v2-app-shortcut-icon" aria-hidden="true">
        <img
          src={homePluginShortcutIconUrl(plugin)}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-app-shortcut-copy">
        <span className="home-v2-app-shortcut-name">{plugin.name}</span>
        <span className="home-v2-app-shortcut-meta">Official plugin</span>
      </span>
    </Link>
  );
}

function HomeAppsShortcutPanel({
  title,
  countLabel,
  side,
  items,
}: {
  title: string;
  countLabel: string;
  side: "skills" | "plugins";
  items: readonly HomeSkillApp[] | readonly HomePluginShortcut[];
}) {
  return (
    <div className={`home-v2-apps-panel home-v2-apps-panel--${side}`}>
      <div className="home-v2-apps-panel-head">
        <h3 className="home-v2-apps-panel-title">{title}</h3>
        <span className="home-v2-apps-panel-count">{countLabel}</span>
      </div>
      <div className="home-v2-apps-shortcut-grid" aria-label={`${title} shortcuts`}>
        {items.map((item) =>
          side === "skills" ? (
            <HomeSkillAppCard key={item.id} app={item as HomeSkillApp} />
          ) : (
            <HomePluginAppCard key={item.id} plugin={item as HomePluginShortcut} />
          ),
        )}
      </div>
    </div>
  );
}

export function HomeAppsSection() {
  return (
    <section className="home-v2-apps" aria-labelledby="home-v2-apps-title">
      <div className="home-v2-apps-header">
        <div className="home-v2-apps-heading">
          <h2 id="home-v2-apps-title" className="home-v2-apps-title">
            Skills for your apps
          </h2>
        </div>
      </div>

      <div className="home-v2-apps-stage">
        <div className="home-v2-apps-orbit" role="group" aria-label="Skills and plugin shortcuts">
          <div className="home-v2-apps-hub" aria-hidden="true">
            <span className="home-v2-apps-hub-core">
              <img src="/og-clawhub-watermark.png" alt="" width={28} height={28} decoding="async" />
            </span>
            <span className="home-v2-apps-hub-label">ClawHub</span>
            <span className="home-v2-apps-hub-count">18 paths</span>
          </div>

          <div className="home-v2-apps-flow">
            <HomeAppsShortcutPanel
              title="Skills"
              countLabel="Browse by tool"
              side="skills"
              items={HOME_SKILL_APPS}
            />
            <HomeAppsShortcutPanel
              title="Plugins"
              countLabel="Official gateways"
              side="plugins"
              items={HOME_PLUGIN_SHORTCUTS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
