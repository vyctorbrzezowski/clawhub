import { PLUGIN_CATEGORY_DEFINITIONS } from "clawhub-schema";
import { BROWSE_TAXONOMY_DEFINITIONS } from "../../convex/lib/browseTaxonomy";

export type SkillCategory = {
  slug: string;
  label: string;
  icon: string;
  keywords: string[];
};

export type BrowseCategory = {
  slug: string;
  label: string;
  icon: string;
};

const BROWSE_SKILL_CATEGORY_ICONS: Record<string, string> = {
  "data-apis": "database",
  "agent-behavior": "brain",
  "media-creative": "palette",
  "automation-workflows": "git-branch",
  "finance-commerce": "coins",
  "web-research": "globe",
  "docs-knowledge": "file-text",
  "dev-tools": "wrench",
  "communication-social": "message-circle",
  "monitoring-ops": "activity",
  "productivity-tasks": "check-square",
  "security-review": "shield",
  "education-learning": "graduation-cap",
  "local-system": "hard-drive",
  "domain-utilities": "box",
};

export const SKILL_CATEGORIES: SkillCategory[] = BROWSE_TAXONOMY_DEFINITIONS.map(
  (category) => ({
    slug: category.slug,
    label: category.label,
    icon: BROWSE_SKILL_CATEGORY_ICONS[category.slug] ?? "package",
    keywords: [...category.keywords],
  }),
);

export const PLUGIN_CATEGORIES: BrowseCategory[] = PLUGIN_CATEGORY_DEFINITIONS.map(
  ({ slug, label, icon }) => ({
    slug,
    label,
    icon,
  }),
);

export const ALL_CATEGORY_KEYWORDS = SKILL_CATEGORIES.flatMap((c) => c.keywords);

type SkillCategoryCandidate = {
  slug: string;
  displayName: string;
  summary?: string | null;
  capabilityTags?: string[] | null;
};

function normalizeCategoryText(value: string) {
  return value.trim().toLowerCase();
}

function tokenizeCategoryText(value: string) {
  return normalizeCategoryText(value).match(/[a-z0-9]+/g) ?? [];
}

function categoryTokenMatchesKeyword(token: string, keyword: string) {
  if (token === keyword) return true;
  if (keyword === "dev") {
    return token === "developer" || token === "development" || token === "devops";
  }
  if (keyword === "api") {
    return token === "apis";
  }
  return keyword.length >= 4 && token.includes(keyword);
}

function stripGeneratedSlugPrefixTokens(tokens: string[]) {
  if (tokens[0] !== "dev") return tokens;
  const maybeGeneratedId = tokens[1];
  if (!maybeGeneratedId || maybeGeneratedId.length < 7 || !/\d/.test(maybeGeneratedId)) {
    return tokens;
  }
  return tokens.slice(2);
}

function getSkillCategoryPrimarySearchTokens(skill: SkillCategoryCandidate) {
  return tokenizeCategoryText(
    [skill.displayName, skill.summary ?? "", ...(skill.capabilityTags ?? [])].join(" "),
  );
}

function scoreSkillCategory(
  primaryTokens: string[],
  slugTokens: string[],
  category: SkillCategory,
) {
  return category.keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeCategoryText(keyword);
    if (!normalizedKeyword) return score;
    const primaryScore = primaryTokens.some((token) =>
      categoryTokenMatchesKeyword(token, normalizedKeyword),
    )
      ? 2
      : 0;
    const slugScore = slugTokens.some((token) =>
      categoryTokenMatchesKeyword(token, normalizedKeyword),
    )
      ? 1
      : 0;
    return score + primaryScore + slugScore;
  }, 0);
}

export function getSkillCategoryForSkill(skill: SkillCategoryCandidate): SkillCategory | null {
  const primaryTokens = getSkillCategoryPrimarySearchTokens(skill);
  const slugTokens = stripGeneratedSlugPrefixTokens(tokenizeCategoryText(skill.slug));
  let bestCategory: SkillCategory | null = null;
  let bestScore = 0;

  for (const category of SKILL_CATEGORIES) {
    const score = scoreSkillCategory(primaryTokens, slugTokens, category);
    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  return bestCategory;
}

export function getSkillCategoryBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return SKILL_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getSkillCategoryByKeyword(keyword: string | null | undefined) {
  const normalizedKeyword = keyword?.trim().toLowerCase();
  if (!normalizedKeyword) return null;
  return SKILL_CATEGORIES.find((category) => category.keywords.includes(normalizedKeyword)) ?? null;
}

export function buildSkillCategoryBrowseHref(category: SkillCategory) {
  const params = new URLSearchParams({ category: category.slug });
  return `/skills?${params.toString()}`;
}
