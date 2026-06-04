import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getHomeAppOrbitPlacement } from "../lib/homeAppOrbit";
import { HOME_APPS, homeAppIconUrl, SKILLS_BROWSE_SEARCH } from "../lib/homeApps";

function HomeAppPill({
  app,
  index,
}: {
  app: (typeof HOME_APPS)[number];
  index: number;
}) {
  const slot = getHomeAppOrbitPlacement(index);

  return (
    <Link
      to="/skills"
      search={{ ...SKILLS_BROWSE_SEARCH, q: app.browseQuery }}
      className="home-v2-app-pill"
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.zIndex,
        opacity: slot.opacity,
        ["--pill-scale" as string]: slot.scale,
        transform: "translate(-50%, -50%) scale(var(--pill-scale))",
      }}
      title={app.description}
      aria-label={`${app.name} — ${app.description} (${app.skillsLabel})`}
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
            Jump straight into skills for tools you already run — each pill opens a focused search,
            not the full catalog.
          </p>
        </div>
        <Link
          to="/skills"
          search={SKILLS_BROWSE_SEARCH}
          className="home-v2-discover-eyebrow home-v2-discover-link"
        >
          Open full search <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="home-v2-apps-stage">
        <div className="home-v2-apps-stage-vignette" aria-hidden="true" />
        <div className="home-v2-apps-stage-fade home-v2-apps-stage-fade--left" aria-hidden="true" />
        <div className="home-v2-apps-stage-fade home-v2-apps-stage-fade--right" aria-hidden="true" />

        <div className="home-v2-apps-orbit" role="group" aria-label="App shortcuts">
          <div className="home-v2-apps-orbit-guides" aria-hidden="true">
            <span className="home-v2-apps-orbit-arc home-v2-apps-orbit-arc--left" />
            <span className="home-v2-apps-orbit-arc home-v2-apps-orbit-arc--right" />
          </div>
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
            <span className="home-v2-apps-hub-count">{HOME_APPS.length} apps</span>
          </div>

          {HOME_APPS.map((app, index) => (
            <HomeAppPill key={app.id} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
