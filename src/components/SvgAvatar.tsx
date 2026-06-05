import { useId } from "react";

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function initialsFor(label: string) {
  const words = label.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

// Deterministic duotone gradient seeded by the label. Saturation/lightness are
// constrained so generated tiles stay tasteful and on-brand rather than neon.
function gradientFor(seed: string) {
  const hash = hashSeed(seed);
  const hue = hash % 360;
  const hueShift = 24 + ((hash >>> 8) % 46);
  return {
    from: `hsl(${hue} 58% 56%)`,
    to: `hsl(${(hue + hueShift) % 360} 56% 42%)`,
    angle: (hash >>> 16) % 360,
  };
}

// Seeded LCG so pattern cells are deterministic but well-distributed per seed.
function makeRng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// Two-tone monochromatic palette: each seed gets a distinct hue, but shared
// saturation/lightness keeps a grid of avatars cohesive instead of garish.
function patternPalette(seed: string) {
  const hue = hashSeed(seed) % 360;
  return {
    bg: `hsl(${hue} 64% 55%)`,
    fg: `hsl(${hue} 58% 36%)`,
  };
}

// Classic 5x5 mirrored identicon: 3 independent columns mirrored across center.
function patternCells(seed: string) {
  const rng = makeRng(seed);
  const grid: boolean[][] = [];
  for (let row = 0; row < 5; row++) {
    const cols: boolean[] = [];
    for (let col = 0; col < 3; col++) {
      cols[col] = rng() > 0.45;
    }
    grid.push([cols[0], cols[1], cols[2], cols[1], cols[0]]);
  }
  return grid;
}

function PatternAvatar({ label, seed }: { label: string; seed: string }) {
  const { bg, fg } = patternPalette(seed);
  const cells = patternCells(seed);

  return (
    <svg
      className="home-v2-svg-avatar"
      viewBox="0 0 5 5"
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
    >
      <rect width="5" height="5" fill={bg} />
      {cells.map((cols, row) =>
        cols.map((filled, col) =>
          filled ? (
            <rect key={`${row}-${col}`} x={col} y={row} width="1" height="1" fill={fg} />
          ) : null
        )
      )}
    </svg>
  );
}

export function SvgAvatar({
  label,
  seed,
  variant = "initials",
}: {
  label: string;
  seed?: string;
  variant?: "initials" | "pattern";
}) {
  const gradientId = useId();
  const resolvedSeed = seed ?? label;

  if (variant === "pattern") {
    return <PatternAvatar label={label} seed={resolvedSeed} />;
  }

  const { from, to, angle } = gradientFor(resolvedSeed);
  const initials = initialsFor(label);

  return (
    <svg
      className="home-v2-svg-avatar"
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill={`url(#${gradientId})`} />
      <circle cx="48" cy="16" r="26" fill="#ffffff" opacity="0.08" />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={initials.length > 1 ? 22 : 26}
        fontWeight="700"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        {initials}
      </text>
    </svg>
  );
}
