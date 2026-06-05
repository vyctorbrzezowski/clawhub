import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  HOME_PLUGIN_SHORTCUTS,
  HOME_SKILL_APPS,
  homeAppIconUrl,
  homePluginShortcutIconUrl,
  SKILLS_BROWSE_SEARCH,
  type HomePluginShortcut,
  type HomeSkillApp,
} from "../lib/homeApps";

function HomeAppsCompactSkill({ app }: { app: HomeSkillApp }) {
  return (
    <Link
      to="/skills"
      search={{ ...SKILLS_BROWSE_SEARCH, q: app.browseQuery }}
      className="home-v2-apps-tile"
      title={app.description}
    >
      <span className="home-v2-apps-tile-icon" aria-hidden="true">
        <img
          src={homeAppIconUrl(app.iconDomain)}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-apps-tile-copy">
        <span className="home-v2-apps-tile-name">{app.name}</span>
        <span className="home-v2-apps-tile-meta">{app.description}</span>
      </span>
      <ArrowRight className="home-v2-apps-tile-arrow" size={14} aria-hidden="true" />
    </Link>
  );
}

function HomeAppsCompactPlugin({ plugin }: { plugin: HomePluginShortcut }) {
  return (
    <Link
      to="/plugins/$name"
      params={{ name: plugin.packageName }}
      className="home-v2-apps-tile"
      title={plugin.description}
    >
      <span className="home-v2-apps-tile-icon" aria-hidden="true">
        <img
          src={homePluginShortcutIconUrl(plugin)}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="home-v2-apps-tile-copy">
        <span className="home-v2-apps-tile-name">{plugin.name}</span>
        <span className="home-v2-apps-tile-meta">{plugin.description}</span>
      </span>
      <ArrowRight className="home-v2-apps-tile-arrow" size={14} aria-hidden="true" />
    </Link>
  );
}

type HomeAppsItemRef = {
  kind: "skill" | "plugin";
  id: string;
};

function skill(id: string): HomeAppsItemRef {
  return { kind: "skill", id };
}

function plugin(id: string): HomeAppsItemRef {
  return { kind: "plugin", id };
}

const appCategories = [
  {
    id: "browsers",
    label: "Browsers",
    items: [
      skill("chrome"),
      plugin("brave"),
      skill("github"),
      skill("notion"),
      skill("linear"),
      skill("figma"),
      skill("raycast"),
      plugin("whatsapp"),
      plugin("matrix"),
      plugin("codex"),
      plugin("discord"),
      plugin("slack"),
      plugin("msteams"),
      plugin("googlechat"),
      skill("aws"),
    ],
  },
  {
    id: "editors",
    label: "Editors",
    items: [
      skill("vscode"),
      skill("cursor"),
      skill("raycast"),
      plugin("codex"),
      skill("github"),
      skill("notion"),
      skill("figma"),
      skill("linear"),
      plugin("slack"),
      plugin("matrix"),
      plugin("discord"),
      plugin("googlechat"),
      plugin("msteams"),
      skill("chrome"),
      plugin("brave"),
    ],
  },
  {
    id: "code",
    label: "Code",
    items: [
      skill("github"),
      skill("vscode"),
      skill("cursor"),
      plugin("codex"),
      skill("aws"),
      skill("raycast"),
      skill("chrome"),
      plugin("matrix"),
      plugin("discord"),
      plugin("slack"),
      plugin("msteams"),
      plugin("googlechat"),
      skill("notion"),
      skill("linear"),
      plugin("brave"),
    ],
  },
  {
    id: "docs",
    label: "Docs",
    items: [
      skill("notion"),
      skill("github"),
      skill("chrome"),
      skill("linear"),
      skill("figma"),
      skill("raycast"),
      plugin("slack"),
      plugin("googlechat"),
      plugin("msteams"),
      plugin("matrix"),
      plugin("discord"),
      plugin("whatsapp"),
      plugin("codex"),
      skill("vscode"),
      plugin("brave"),
    ],
  },
  {
    id: "design",
    label: "Design",
    items: [
      skill("figma"),
      skill("notion"),
      skill("chrome"),
      skill("linear"),
      skill("vscode"),
      skill("cursor"),
      plugin("discord"),
      plugin("slack"),
      plugin("matrix"),
      plugin("googlechat"),
      plugin("msteams"),
      plugin("whatsapp"),
      plugin("codex"),
      skill("github"),
      plugin("brave"),
    ],
  },
  {
    id: "chat",
    label: "Chat",
    items: [
      plugin("whatsapp"),
      plugin("matrix"),
      plugin("discord"),
      plugin("slack"),
      plugin("msteams"),
      plugin("googlechat"),
      skill("chrome"),
      skill("raycast"),
      skill("notion"),
      skill("linear"),
      skill("github"),
      plugin("codex"),
      skill("vscode"),
      skill("cursor"),
      plugin("brave"),
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    items: [
      skill("aws"),
      skill("github"),
      skill("vscode"),
      skill("cursor"),
      plugin("codex"),
      plugin("slack"),
      plugin("googlechat"),
      plugin("msteams"),
      plugin("matrix"),
      plugin("discord"),
      plugin("brave"),
      skill("chrome"),
      skill("raycast"),
      skill("notion"),
      skill("linear"),
    ],
  },
] as const;

export function HomeAppsSection() {
  const [activeCategoryId, setActiveCategoryId] = useState<(typeof appCategories)[number]["id"]>(appCategories[0].id);
  const compactItems = useMemo(() => {
    const activeCategory = appCategories.find((category) => category.id === activeCategoryId) ?? appCategories[0];
    return activeCategory.items
      .map((item) => {
        if (item.kind === "skill") {
          const app = HOME_SKILL_APPS.find((candidate) => candidate.id === item.id);
          return app ? ({ kind: "skill" as const, app }) : null;
        }
        const matchedPlugin = HOME_PLUGIN_SHORTCUTS.find((candidate) => candidate.id === item.id);
        return matchedPlugin ? ({ kind: "plugin" as const, plugin: matchedPlugin }) : null;
      })
      .filter((item): item is { kind: "skill"; app: HomeSkillApp } | { kind: "plugin"; plugin: HomePluginShortcut } =>
        Boolean(item)
      );
  }, [activeCategoryId]);

  return (
    <section className="home-v2-apps" aria-labelledby="home-v2-apps-title">
      <div className="home-v2-apps-stage">
        <div className="home-v2-apps-intro">
          <span className="home-v2-apps-intro-copy">
            <h2 id="home-v2-apps-title" className="home-v2-apps-title">
              Skills for your apps
            </h2>
            <p>Grouped by app surface — pick where your agent works.</p>
          </span>
          <Link to="/skills" search={SKILLS_BROWSE_SEARCH} className="home-v2-apps-view-all">
            View all skills
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="home-v2-apps-categories" role="tablist" aria-label="App categories">
          {appCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={category.id === activeCategoryId}
              className="home-v2-apps-category-tab"
              onClick={() => setActiveCategoryId(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="home-v2-apps-tile-grid" aria-label="App and plugin shortcuts">
          {compactItems.map((item) =>
            item.kind === "skill" ? (
              <HomeAppsCompactSkill key={`skill-${item.app.id}`} app={item.app} />
            ) : (
              <HomeAppsCompactPlugin key={`plugin-${item.plugin.id}`} plugin={item.plugin} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
