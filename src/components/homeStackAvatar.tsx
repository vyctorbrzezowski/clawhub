import type { HomeStackAvatarKind } from "../lib/homeStacks";

export function StackAvatar({
  label,
  logoUrl,
  size = "md",
  kind = "org",
}: {
  label: string;
  logoUrl?: string;
  size?: "md" | "sm";
  kind?: HomeStackAvatarKind;
}) {
  const shapeClass =
    kind === "user" ? "home-v2-stack-avatar--user" : "home-v2-stack-avatar--org";
  const className = [
    "home-v2-stack-avatar",
    shapeClass,
    logoUrl ? "home-v2-stack-avatar--image" : "",
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
