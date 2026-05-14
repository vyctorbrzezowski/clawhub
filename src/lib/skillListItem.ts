export type SkillListItemSkill = {
  _id: string;
  slug: string;
  displayName: string;
  summary?: string | null;
  icon?: string | null;
  ownerUserId: string;
  ownerPublisherId?: string | null;
  stats: { stars: number; downloads: number };
  updatedAt: number;
  badges?: Record<string, unknown> | null;
};
