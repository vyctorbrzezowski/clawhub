import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getHomeStackHref,
  HOME_COLLECTION_STACKS,
  HOME_TRENDING_STACKS,
  HOME_COLLECTIONS_HEADING,
  HOME_COLLECTIONS_LEDE,
  type HomeStack,
} from "../lib/homeStacks";
import { StackAvatar } from "./homeStackAvatar";

const TREND_DRAG_CLICK_THRESHOLD_PX = 6;

function TrendingStackCard({
  stack,
  suppressNavigation,
}: {
  stack: HomeStack;
  suppressNavigation?: boolean;
}) {
  const href = getHomeStackHref(stack);
  return (
    <Link
      {...href}
      className="home-v2-stack-trend-card"
      aria-label={`${stack.title} — ${stack.description}`}
      tabIndex={suppressNavigation ? -1 : undefined}
      onClick={(event) => {
        if (suppressNavigation) {
          event.preventDefault();
        }
      }}
    >
      <div className="home-v2-stack-trend-head">
        <StackAvatar
          label={stack.title}
          patternKey={stack.id}
          kind="org"
          size="sm"
          variant="pattern"
        />
        <span className="home-v2-stack-trend-title">{stack.title}</span>
      </div>
      <div className="home-v2-stack-trend-copy">
        <p className="home-v2-stack-trend-desc">{stack.description}</p>
        <span className="home-v2-stack-trend-stat">{stack.statsLabel}</span>
      </div>
    </Link>
  );
}

function TrendingStacksCarousel({ stacks }: { stacks: HomeStack[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [suppressCardClick, setSuppressCardClick] = useState(false);

  const updateScrollEdges = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setCanScrollNext(viewport.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    updateScrollEdges();
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener("scroll", updateScrollEdges, { passive: true });
    return () => viewport.removeEventListener("scroll", updateScrollEdges);
  }, [updateScrollEdges, stacks.length]);

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!viewport || !drag || drag.pointerId !== event.pointerId) return;

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    if (drag.moved) {
      setSuppressCardClick(true);
      window.setTimeout(() => setSuppressCardClick(false), 0);
    }

    dragRef.current = null;
    setIsDragging(false);
    updateScrollEdges();
  };

  const handleViewportPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewport.scrollLeft,
      moved: false,
    };
    viewport.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handleViewportPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!viewport || !drag || drag.pointerId !== event.pointerId) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > TREND_DRAG_CLICK_THRESHOLD_PX) {
      drag.moved = true;
    }
    viewport.scrollLeft = drag.startScrollLeft - delta;
  };

  return (
    <div className={`home-v2-stack-trend-rail${canScrollNext ? " can-next" : ""}`}>
      <div
        ref={viewportRef}
        className={`home-v2-stack-trend-viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={handleViewportPointerDown}
        onPointerMove={handleViewportPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="home-v2-stack-trend-track" role="list">
          {stacks.map((stack) => (
            <TrendingStackCard
              key={stack.id}
              stack={stack}
              suppressNavigation={suppressCardClick}
            />
          ))}
        </div>
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
      <StackAvatar
        label={stack.title}
        patternKey={stack.id}
        size="sm"
        kind="org"
        variant="pattern"
      />
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
      <div className="home-v2-discover-chapter">
        <div className="home-v2-discover-header">
          <div className="home-v2-discover-heading">
            <h2 className="home-v2-discover-title">Trending stacks</h2>
            <p className="home-v2-discover-lede">
              Use the same stacks trusted by standout engineers and builders.
            </p>
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
        <TrendingStacksCarousel stacks={HOME_TRENDING_STACKS} />
      </div>

      <div className="home-v2-discover-chapter">
        <div className="home-v2-discover-header">
          <div className="home-v2-discover-heading">
            <h2 className="home-v2-discover-title">{HOME_COLLECTIONS_HEADING}</h2>
            <p className="home-v2-discover-lede">{HOME_COLLECTIONS_LEDE}</p>
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
