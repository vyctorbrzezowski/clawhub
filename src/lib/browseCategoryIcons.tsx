import {
  Activity,
  Box,
  Brain,
  CheckSquare,
  Coins,
  Database,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  Layers,
  MessageCircle,
  Package,
  Palette,
  Plug,
  Rocket,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PLUGIN_CATEGORIES, SKILL_CATEGORIES } from "./categories";

const ICON_COMPONENTS: Record<string, LucideIcon> = {
  activity: Activity,
  box: Box,
  brain: Brain,
  "check-square": CheckSquare,
  coins: Coins,
  database: Database,
  "file-text": FileText,
  "git-branch": GitBranch,
  globe: Globe,
  "graduation-cap": GraduationCap,
  "hard-drive": HardDrive,
  "message-circle": MessageCircle,
  package: Package,
  palette: Palette,
  plug: Plug,
  rocket: Rocket,
  shield: Shield,
  wrench: Wrench,
  zap: Zap,
};

type BrowseCategoryIconProps = {
  slug: string | null;
  size?: number;
  className?: string;
};

export function BrowseCategoryIcon({ slug, size = 16, className }: BrowseCategoryIconProps) {
  if (!slug) {
    return <Layers size={size} className={className} aria-hidden="true" />;
  }
  const iconKey =
    SKILL_CATEGORIES.find((category) => category.slug === slug)?.icon ??
    PLUGIN_CATEGORIES.find((category) => category.slug === slug)?.icon ??
    "package";
  const Icon = ICON_COMPONENTS[iconKey] ?? Package;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
