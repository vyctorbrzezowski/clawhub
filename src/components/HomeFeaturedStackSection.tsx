import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getHomeStackHref,
  homeStackAvatarKind,
  HOME_FEATURED_STACK,
  HOME_STAFF_CURATED_STACKS,
  type HomeStack,
  type HomeStackPreview,
} from "../lib/homeStacks";
import { StackAvatar } from "./homeStackAvatar";

const FEATURE_DECK_INTERVAL_MS = 4200;

type FeaturedPreviewCardProps = {
  preview: HomeStackPreview;
  href: ReturnType<typeof getHomeStackHref>;
  layer: number;
};

function FeaturedPreviewCard({ preview, href, layer }: FeaturedPreviewCardProps) {
  return (
    <Link
      {...href}
      className={`home-v2-stack-feature-item is-layer-${layer}`}
      aria-label={`${preview.title} — ${preview.meta}`}
    >
      <StackAvatar label={preview.title} size="sm" kind="org" />
      <span className="home-v2-stack-feature-item-title">{preview.title}</span>
      <span className="home-v2-stack-feature-item-meta">{preview.meta}</span>
    </Link>
  );
}

function FeaturedPreviewDeck({
  previews,
  href,
}: {
  previews: HomeStackPreview[];
  href: ReturnType<typeof getHomeStackHref>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = previews.length;

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, FEATURE_DECK_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <div
      className="home-v2-stack-feature-deck"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {previews.map((preview, index) => {
        const layer = (index - activeIndex + count) % count;
        return (
          <FeaturedPreviewCard key={preview.title} preview={preview} href={href} layer={layer} />
        );
      })}
    </div>
  );
}

function FeaturedStackBanner({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const previews = stack.previews ?? [];

  return (
    <div className="home-v2-stack-feature home-v2-stack-feature--hero">
      <div className="home-v2-stack-feature-lead">
        <span className="home-v2-stack-feature-eyebrow">Editor&rsquo;s pick</span>
        <div className="home-v2-stack-feature-id">
          <StackAvatar
            label={stack.title}
            logoUrl={stack.logoUrl}
            kind={homeStackAvatarKind(stack)}
          />
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
      <div
        className="home-v2-stack-feature-items"
        aria-label="Featured skills preview"
        role="group"
      >
        <FeaturedPreviewDeck previews={previews} href={href} />
      </div>
    </div>
  );
}

function StaffCuratedRow({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const tags = stack.collectionTags ?? [];

  return (
    <Link {...href} className="home-v2-staff-curated-row">
      <StackAvatar
        label={stack.title}
        logoUrl={stack.logoUrl}
        size="sm"
        kind={homeStackAvatarKind(stack)}
      />
      <span className="home-v2-staff-curated-copy">
        <span className="home-v2-staff-curated-title">{stack.title}</span>
        {tags[0] ? (
          <span className="home-v2-staff-curated-meta">{tags.slice(0, 2).join(" · ")}</span>
        ) : (
          <span className="home-v2-staff-curated-meta">{stack.statsLabel}</span>
        )}
      </span>
      <span className="home-v2-staff-curated-stat">{stack.statsLabel}</span>
    </Link>
  );
}

function StaffCuratedCollectionsPanel({ stacks }: { stacks: HomeStack[] }) {
  return (
    <div className="home-v2-stack-feature home-v2-stack-feature--muted">
      <div className="home-v2-stack-feature-lead home-v2-stack-feature-lead--compact">
        <span className="home-v2-stack-feature-eyebrow home-v2-stack-feature-eyebrow--muted">
          Curated by ClawHub
        </span>
        <h3 className="home-v2-stack-feature-title home-v2-stack-feature-title--panel">
          Staff collections
        </h3>
        <p className="home-v2-stack-feature-desc home-v2-stack-feature-desc--panel">
          More starting points from the team — publishers and themes from the catalog.
        </p>
      </div>
      <ul className="home-v2-staff-curated-list" aria-label="Staff curated collections">
        {stacks.map((stack) => (
          <li key={stack.id}>
            <StaffCuratedRow stack={stack} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeFeaturedStackSection() {
  return (
    <section className="home-v2-featured-spotlight" aria-label="Featured collections">
      <div className="home-v2-featured-spotlight-grid">
        <div className="home-v2-featured-spotlight-col">
          <FeaturedStackBanner stack={HOME_FEATURED_STACK} />
        </div>
        <div className="home-v2-featured-spotlight-col">
          <StaffCuratedCollectionsPanel stacks={HOME_STAFF_CURATED_STACKS} />
        </div>
      </div>
    </section>
  );
}
