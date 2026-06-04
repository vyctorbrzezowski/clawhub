import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  getHomeStackHref,
  HOME_EDITORIAL_STACKS,
  HOME_TRENDING_STACKS,
  type HomeStack,
} from "../lib/homeStacks";

function StackAvatar({ label }: { label: string }) {
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return <span className="home-v2-stack-avatar">{initial}</span>;
}

function TrendingStackCard({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  return (
    <Link
      {...href}
      className="home-v2-stack-trend-card"
      aria-label={`${stack.title} — ${stack.description}`}
    >
      <StackAvatar label={stack.title} />
      <div className="home-v2-stack-trend-copy">
        <span className="home-v2-stack-trend-title">{stack.title}</span>
        <span className="home-v2-stack-trend-stat">{stack.statsLabel}</span>
      </div>
      {stack.growthLabel ? (
        <span className="home-v2-stack-trend-growth">{stack.growthLabel}</span>
      ) : null}
    </Link>
  );
}

function EditorialStackCard({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const previews = stack.previews ?? [];

  return (
    <article className="home-v2-stack-editorial">
      <div className="home-v2-stack-editorial-head">
        <div>
          <h3 className="home-v2-stack-editorial-title">{stack.title}</h3>
          <p className="home-v2-stack-editorial-desc">{stack.description}</p>
        </div>
        <Link {...href} className="home-v2-stack-editorial-link">
          View stack <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ul className="home-v2-stack-editorial-list">
        {previews.map((preview) => (
          <li key={preview.title}>
            <Link {...href} className="home-v2-stack-editorial-row">
              <StackAvatar label={preview.title} />
              <span className="home-v2-stack-editorial-row-body">
                <span className="home-v2-stack-editorial-row-title">{preview.title}</span>
                <span className="home-v2-stack-editorial-row-meta">{preview.meta}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function HomeDiscoverSection() {
  return (
    <section className="home-v2-discover" aria-label="Curated stacks and collections">
      <div className="home-v2-discover-block">
        <div className="home-v2-discover-header">
          <h2 className="home-v2-discover-title">Trending stacks</h2>
          <span className="home-v2-discover-eyebrow">Fastest growing this week</span>
        </div>
        <div className="home-v2-stack-rail-wrap">
          <div className="home-v2-stack-rail" role="list">
            {HOME_TRENDING_STACKS.map((stack) => (
              <TrendingStackCard key={stack.id} stack={stack} />
            ))}
          </div>
        </div>
      </div>

      <div className="home-v2-discover-block">
        <div className="home-v2-discover-header">
          <h2 className="home-v2-discover-title">Collections</h2>
          <Link to="/publishers" className="home-v2-discover-eyebrow home-v2-discover-link">
            Browse publishers <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-v2-stack-editorial-grid">
          {HOME_EDITORIAL_STACKS.map((stack) => (
            <EditorialStackCard key={stack.id} stack={stack} />
          ))}
        </div>
      </div>
    </section>
  );
}
