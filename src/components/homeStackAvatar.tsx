import type { HomeStackAvatarKind } from "../lib/homeStacks";

const STACK_AVATAR_PATTERNS = [
  "home-v2-stack-avatar--tone-red",
  "home-v2-stack-avatar--tone-amber",
  "home-v2-stack-avatar--tone-green",
  "home-v2-stack-avatar--tone-cyan",
  "home-v2-stack-avatar--tone-violet",
  "home-v2-stack-avatar--tone-slate",
] as const;

function avatarPatternClass(patternKey?: string) {
  if (!patternKey) return "";
  let hash = 0;
  for (const char of patternKey) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return STACK_AVATAR_PATTERNS[hash % STACK_AVATAR_PATTERNS.length];
}

export function StackAvatar({
  label,
  logoUrl,
  patternKey,
  size = "md",
  kind = "org",
}: {
  label: string;
  logoUrl?: string;
  patternKey?: string;
  size?: "md" | "sm";
  kind?: HomeStackAvatarKind;
}) {
  const shapeClass =
    kind === "user" ? "home-v2-stack-avatar--user" : "home-v2-stack-avatar--org";
  const className = [
    "home-v2-stack-avatar",
    shapeClass,
    logoUrl ? "home-v2-stack-avatar--image" : "",
    !logoUrl ? avatarPatternClass(patternKey ?? label) : "",
    size === "sm" ? "home-v2-stack-avatar--sm" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (logoUrl) {
    return (
      <span className={className}>
        <img
          src={logoUrl}
          alt=""
          width={size === "sm" ? 32 : 44}
          height={size === "sm" ? 32 : 44}
          decoding="async"
        />
      </span>
    );
  }
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return <span className={className}>{initial}</span>;
}
