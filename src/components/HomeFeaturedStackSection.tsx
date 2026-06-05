import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { SKILLS_BROWSE_SEARCH } from "../lib/homeApps";
import {
  getHomeStackHref,
  homeStackAvatarKind,
  HOME_FEATURED_STACK,
  HOME_FEATURED_STACK_EYEBROW,
  HOME_STAFF_CURATED_STACKS,
  HOME_COLLECTIONS_HEADING,
  HOME_COLLECTIONS_LEDE,
  type HomeStack,
  type HomeStackPreview,
} from "../lib/homeStacks";
import { StackAvatar } from "./homeStackAvatar";

const FEATURE_DECK_INTERVAL_MS = 4200;
const FEATURE_DECK_DRAG_CLICK_THRESHOLD_PX = 6;
const FEATURE_DECK_SWIPE_THRESHOLD_PX = 38;

type FeaturedPreviewCardProps = {
  preview: HomeStackPreview;
  href: ReturnType<typeof getHomeStackHref>;
  layer: number;
  onActivate: () => void;
  onPause: () => void;
  onResume: () => void;
  onClickCapture?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function FeaturedPreviewCard({
  preview,
  href,
  layer,
  onActivate,
  onPause,
  onResume,
  onClickCapture,
}: FeaturedPreviewCardProps) {
  return (
    <Link
      {...href}
      className={`home-v2-stack-feature-item is-layer-${layer}`}
      aria-label={`${preview.title} — ${preview.meta}. ${preview.description}`}
      onClickCapture={(event) => {
        onClickCapture?.(event);
        if (event.defaultPrevented || layer === 0) return;
        event.preventDefault();
        event.stopPropagation();
        onActivate();
      }}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
    >
      <StackAvatar label={preview.title} size="sm" kind="org" />
      <span className="home-v2-stack-feature-item-copy">
        <span className="home-v2-stack-feature-item-title">{preview.title}</span>
        <span className="home-v2-stack-feature-item-meta">{preview.meta}</span>
      </span>
      <span className="home-v2-stack-feature-item-desc">{preview.description}</span>
      <span className="home-v2-stack-feature-item-signals" aria-hidden="true">
        {preview.signals.map((signal) => (
          <span key={signal} className="home-v2-stack-feature-item-signal">
            {signal}
          </span>
        ))}
      </span>
    </Link>
  );
}

function FeaturedPreviewDeck({
  previews,
  href,
  activeIndex,
  setActiveIndex,
  setHoverPaused,
  onPrevious,
  onNext,
}: {
  previews: HomeStackPreview[];
  href: ReturnType<typeof getHomeStackHref>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  setHoverPaused: (paused: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const count = previews.length;
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    lastX: number;
    dragged: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  if (count === 0) return null;

  const suppressDraggedClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = drag.lastX - drag.startX;
    const absDeltaX = Math.abs(deltaX);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
    setHoverPaused(false);

    if (absDeltaX > FEATURE_DECK_DRAG_CLICK_THRESHOLD_PX) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    if (absDeltaX < FEATURE_DECK_SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) onNext();
    else onPrevious();
  };

  return (
    <div
      className={`home-v2-stack-feature-deck${isDragging ? " is-dragging" : ""}`}
      onPointerDown={(event) => {
        if (event.button !== 0 || count <= 1) return;
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          lastX: event.clientX,
          dragged: false,
        };
        setIsDragging(true);
        setHoverPaused(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        drag.lastX = event.clientX;
        if (Math.abs(drag.lastX - drag.startX) > FEATURE_DECK_DRAG_CLICK_THRESHOLD_PX) {
          drag.dragged = true;
        }
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      {previews.map((preview, index) => {
        const layer = (index - activeIndex + count) % count;
        return (
          <FeaturedPreviewCard
            key={preview.title}
            preview={preview}
            href={href}
            layer={layer}
            onActivate={() => setActiveIndex(index)}
            onPause={() => setHoverPaused(true)}
            onResume={() => setHoverPaused(false)}
            onClickCapture={suppressDraggedClick}
          />
        );
      })}
    </div>
  );
}

function FeaturedStackBanner({ stack }: { stack: HomeStack }) {
  const href = getHomeStackHref(stack);
  const previews = stack.previews ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const count = previews.length;
  const paused = manualPaused || hoverPaused;

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, FEATURE_DECK_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  const showPrevious = () => {
    if (count <= 1) return;
    setActiveIndex((current) => (current - 1 + count) % count);
  };

  const showNext = () => {
    if (count <= 1) return;
    setActiveIndex((current) => (current + 1) % count);
  };

  return (
    <div className="home-v2-stack-feature home-v2-stack-feature--hero">
      <div className="home-v2-stack-feature-lead">
        <span className="home-v2-stack-feature-eyebrow">{HOME_FEATURED_STACK_EYEBROW}</span>
        <div className="home-v2-stack-feature-id">
          <StackAvatar
            label={stack.title}
            logoUrl={stack.logoUrl}
            kind={homeStackAvatarKind(stack)}
          />
          <div>
            <h3 className="home-v2-stack-feature-title">{stack.title}</h3>
            <p className="home-v2-stack-feature-stat">{stack.statsLabel}</p>
          </div>
        </div>
        <p className="home-v2-stack-feature-desc">{stack.description}</p>
        <Link {...href} className="home-v2-stack-feature-link">
          View full collection <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div
        className="home-v2-stack-feature-items"
        aria-label="Featured skills preview"
        role="group"
      >
        <FeaturedPreviewDeck
          previews={previews}
          href={href}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setHoverPaused={setHoverPaused}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      </div>
      <div className="home-v2-stack-feature-footer" aria-label="Collection contents">
        <span>{stack.growthLabel}</span>
      </div>
      <div className="home-v2-stack-feature-controls" aria-label="Featured skill controls">
        <button type="button" onClick={showPrevious} aria-label="Previous featured skill">
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (paused) {
              setManualPaused(false);
              setHoverPaused(false);
              return;
            }
            setManualPaused(true);
          }}
          aria-label={paused ? "Resume featured skills" : "Pause featured skills"}
          aria-pressed={manualPaused}
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
        <button type="button" onClick={showNext} aria-label="Next featured skill">
          <ChevronRight size={15} aria-hidden="true" />
        </button>
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
      <div className="home-v2-discover-heading home-v2-topics-panel-lead">
        <h2 className="home-v2-discover-title">{HOME_COLLECTIONS_HEADING}</h2>
        <p className="home-v2-discover-lede">{HOME_COLLECTIONS_LEDE}</p>
      </div>
      <ul className="home-v2-staff-curated-list" aria-label="Topic collections">
        {stacks.map((stack) => (
          <li key={stack.id}>
            <StaffCuratedRow stack={stack} />
          </li>
        ))}
      </ul>
      <Link to="/skills" search={SKILLS_BROWSE_SEARCH} className="home-v2-staff-curated-see-all">
        See all
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function HomeFeaturedStackSection() {
  return (
    <section className="home-v2-featured-spotlight" aria-label="Featured collections">
      <div className="home-v2-featured-spotlight-grid">
        <div className="home-v2-featured-spotlight-col home-v2-featured-spotlight-col--hero">
          <FeaturedStackBanner stack={HOME_FEATURED_STACK} />
        </div>
        <div className="home-v2-featured-spotlight-col home-v2-featured-spotlight-col--staff">
          <StaffCuratedCollectionsPanel stacks={HOME_STAFF_CURATED_STACKS} />
        </div>
      </div>
    </section>
  );
}
