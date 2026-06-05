import type { HomeStackAvatarKind } from "../lib/homeStacks";
import { SvgAvatar } from "./SvgAvatar";

export function StackAvatar({
  label,
  logoUrl,
  patternKey,
  size = "md",
  kind = "org",
  variant = "initials",
}: {
  label: string;
  logoUrl?: string;
  patternKey?: string;
  size?: "md" | "sm";
  kind?: HomeStackAvatarKind;
  variant?: "initials" | "pattern";
}) {
  const shapeClass =
    kind === "user" ? "home-v2-stack-avatar--user" : "home-v2-stack-avatar--org";
  // Pattern avatars are always generated — they intentionally replace any logo.
  const useGenerated = variant === "pattern" || !logoUrl;
  const className = [
    "home-v2-stack-avatar",
    shapeClass,
    useGenerated ? "home-v2-stack-avatar--generated" : "home-v2-stack-avatar--image",
    size === "sm" ? "home-v2-stack-avatar--sm" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!useGenerated && logoUrl) {
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
  return (
    <span className={className}>
      <SvgAvatar label={label} seed={patternKey ?? label} variant={variant} />
    </span>
  );
}
