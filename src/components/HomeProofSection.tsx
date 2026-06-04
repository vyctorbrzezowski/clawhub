import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { convexHttp } from "../convex/client";
import {
  HOME_PROOF_DOWNLOAD_FLOOR,
  HOME_PROOF_FEATURES,
  HOME_PROOF_PILLS,
  HOME_PROOF_PLUGIN_FLOOR,
  HOME_PUBLISHER_STAT,
} from "../lib/homeProof";
import { formatCompactStat } from "../lib/numberFormat";

type ProofStat = {
  value: string;
  label: string;
};

function ProofLink({ item }: { item: (typeof HOME_PROOF_PILLS)[number] }) {
  const className = "home-v2-proof-link";
  const content = (
    <>
      {item.label}
      <ArrowRight size={14} aria-hidden="true" />
    </>
  );

  if ("href" in item) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={item.to} className={className}>
      {content}
    </Link>
  );
}

export function HomeProofSection() {
  const [skillCount, setSkillCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void convexHttp
      .query(api.skills.countPublicSkills, {})
      .then((count) => {
        if (!cancelled) setSkillCount(count);
      })
      .catch(() => {
        if (!cancelled) setSkillCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats: ProofStat[] = [
    {
      value: skillCount != null ? formatCompactStat(skillCount) : "16K+",
      label: "skills",
    },
    {
      value: `${formatCompactStat(HOME_PROOF_PLUGIN_FLOOR)}+`,
      label: "plugins",
    },
    {
      value: HOME_PUBLISHER_STAT,
      label: "publishers",
    },
    {
      value: `${formatCompactStat(HOME_PROOF_DOWNLOAD_FLOOR)}+`,
      label: "downloads",
    },
  ];

  return (
    <section className="home-v2-proof" aria-labelledby="home-v2-proof-title">
      <div className="home-v2-proof-inner">
        <div className="home-v2-proof-stats" role="list" aria-label="Catalog scale">
          {stats.map((stat, index) => (
            <div key={stat.label} className="home-v2-proof-stat" role="listitem">
              {index > 0 ? (
                <span className="home-v2-proof-stat-sep" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <span className="home-v2-proof-num">{stat.value}</span>
              <span className="home-v2-proof-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="home-v2-proof-main">
          <header className="home-v2-proof-header">
            <p className="home-v2-proof-eyebrow">Why ClawHub</p>
            <h2 id="home-v2-proof-title" className="home-v2-proof-title">
              The registry for OpenClaw agents
            </h2>
            <p className="home-v2-proof-lede">
              Versioned skills, gateway plugins, and security context from {HOME_PUBLISHER_STAT}{" "}
              publishers — ready to install in one search.
            </p>
            <nav className="home-v2-proof-links" aria-label="Explore ClawHub">
              {HOME_PROOF_PILLS.map((item) => (
                <ProofLink key={item.label} item={item} />
              ))}
            </nav>
          </header>

          <ul className="home-v2-proof-points">
            {HOME_PROOF_FEATURES.map((feature) => (
              <li key={feature.id} className="home-v2-proof-point">
                <h3 className="home-v2-proof-point-title">{feature.title}</h3>
                <p className="home-v2-proof-point-desc">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
