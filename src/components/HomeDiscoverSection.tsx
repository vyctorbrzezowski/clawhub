import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  getHomeStackHref,
  HOME_COLLECTION_STACKS,
  HOME_FEATURED_STACK,
  HOME_TRENDING_STACKS,
  type HomeStack,
} from "../lib/homeStacks";

function StackAvatar({
  label,
  logoUrl,
  size = "md",
}: {
  label: string;
  logoUrl?: string;
  size?: "md" | "sm";
}) {
  const className = `home-v2-stack-avatar${logoUrl ? " home-v2-stack-avatar--image" : ""}${size === "sm" ? " home-v2-stack-avatar--sm" : ""}`;
  if (logoUrl) {
    return (
      <span className={className}>
        <img src={logoUrl} alt="" width={size === "sm" ? 32 : 44} height={size === "sm" ? 32 : 44} decoding="async" />
      </span>
    );
  }
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return <span className={className}>{initial}</span>;
}

function TrendingStackCard({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const direction = stack.growthDirection ?? "up";
  return (
    <Link
      {...href}
      className="home-v2-stack-trend-card"
      aria-label={`${stack.title} — ${stack.description}`}
    >
      <StackAvatar label={stack.title} logoUrl={stack.logoUrl} />
      <div className="home-v2-stack-trend-copy">
        <span className="home-v2-stack-trend-title">{stack.title}</span>
        <p className="home-v2-stack-trend-desc">{stack.description}</p>
        <span className="home-v2-stack-trend-stat">{stack.statsLabel}</span>
      </div>
      {stack.growthLabel ? (
        <span className={`home-v2-stack-trend-growth is-${direction}`}>
          {stack.growthLabel}
        </span>
      ) : null}
    </Link>
  );
}

function FeaturedStackBanner({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const previews = stack.previews ?? [];
  return (
    <div className="home-v2-stack-feature">
      <div className="home-v2-stack-feature-lead">
        <span className="home-v2-stack-feature-eyebrow">Editor&rsquo;s pick</span>
        <div className="home-v2-stack-feature-id">
          <StackAvatar label={stack.title} logoUrl={stack.logoUrl} />
          <div>
            <h3 className="home-v2-stack-feature-title">{stack.title}</h3>
            <p className="home-v2-stack-feature-stat">
              {stack.statsLabel}
              {stack.growthLabel ? (
                <span className="home-v2-stack-feature-delta">{stack.growthLabel}</span>
              ) : null}
            </p>
          </div>
        </div>
        <p className="home-v2-stack-feature-desc">{stack.description}</p>
        <Link {...href} className="home-v2-stack-feature-link">
          View collection <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="home-v2-stack-feature-items">
        {previews.map((preview) => (
          <Link {...href} key={preview.title} className="home-v2-stack-feature-item">
            <StackAvatar label={preview.title} size="sm" />
            <span className="home-v2-stack-feature-item-title">{preview.title}</span>
            <span className="home-v2-stack-feature-item-meta">{preview.meta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CollectionCard({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const tags = stack.collectionTags ?? [];

  return (
    <Link
      {...href}
      className="home-v2-collection-card"
      aria-label={`${stack.title} — ${stack.description}`}
    >
      <StackAvatar label={stack.title} logoUrl={stack.logoUrl} size="sm" />
      <div className="home-v2-collection-copy">
        <h3 className="home-v2-collection-title">{stack.title}</h3>
        <p className="home-v2-collection-desc">{stack.description}</p>
        {tags.length > 0 ? (
          <ul className="home-v2-collection-tags" aria-label="Topics">
            {tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <span className="home-v2-collection-stat">{stack.statsLabel}</span>
    </Link>
  );
}

export function HomeDiscoverSection() {
  return (
    <section className="home-v2-discover" aria-label="Curated discovery">
      <div className="home-v2-discover-chapter home-v2-discover-chapter--spotlight">
        <FeaturedStackBanner stack={HOME_FEATURED_STACK} />
      </div>

      <div className="home-v2-discover-chapter">
        <div className="home-v2-discover-header">
          <div className="home-v2-discover-heading">
            <h2 className="home-v2-discover-title">Trending stacks</h2>
            <p className="home-v2-discover-lede">Publishers and themes gaining installs this week.</p>
          </div>
          <Link
            to="/skills"
            search={{
              sort: "downloads",
              dir: "desc",
              q: undefined,
              highlighted: undefined,
              view: undefined,
              focus: undefined,
            }}
            className="home-v2-discover-eyebrow home-v2-discover-link"
          >
            See what&apos;s rising <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-v2-stack-trend-rail">
          <div className="home-v2-stack-trend-track" role="list">
            {HOME_TRENDING_STACKS.map((stack) => (
              <TrendingStackCard key={stack.id} stack={stack} />
            ))}
          </div>
        </div>
      </div>

      <div className="home-v2-discover-chapter">
        <div className="home-v2-discover-header">
          <div className="home-v2-discover-heading">
            <h2 className="home-v2-discover-title">More collections</h2>
            <p className="home-v2-discover-lede">Curated starting points — not another full browse.</p>
          </div>
          <Link to="/publishers" className="home-v2-discover-eyebrow home-v2-discover-link">
            Browse publishers <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-v2-collection-grid" role="list">
          {HOME_COLLECTION_STACKS.map((stack) => (
            <CollectionCard key={stack.id} stack={stack} />
          ))}
        </div>
      </div>
    </section>
  );
}
