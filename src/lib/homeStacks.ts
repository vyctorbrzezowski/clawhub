/** Design-time curated stacks for the home discoverability prototype. */

export type HomeStackPreview = {
  title: string;
  meta: string;
};

export type HomeStack = {
  id: string;
  title: string;
  description: string;
  /** Publisher profile route when the stack maps to a known builder/org. */
  publisherHandle?: string;
  /** Browse fallback when the stack is thematic rather than owner-scoped. */
  browseQuery?: string;
  statsLabel: string;
  growthLabel?: string;
  previews?: HomeStackPreview[];
};

export const HOME_TRENDING_STACKS: HomeStack[] = [
  {
    id: "peter-steinberger",
    title: "Peter Steinberger",
    description: "Core OpenClaw skills from the ecosystem architect.",
    publisherHandle: "steipete",
    statsLabel: "24 skills",
    growthLabel: "+43%",
  },
  {
    id: "nvidia",
    title: "NVIDIA",
    description: "GPU, inference, and agent tooling from NVIDIA publishers.",
    publisherHandle: "nvidia",
    statsLabel: "18 skills",
    growthLabel: "+28%",
  },
  {
    id: "gary-tan",
    title: "Gary Tan",
    description: "Startup ops, growth, and founder workflows.",
    publisherHandle: "garytan",
    statsLabel: "11 skills",
    growthLabel: "+19%",
  },
  {
    id: "openclaw",
    title: "OpenClaw",
    description: "Official gateway, plugins, and reference agents.",
    publisherHandle: "openclaw",
    statsLabel: "32 skills",
    growthLabel: "+12%",
  },
  {
    id: "security",
    title: "Security essentials",
    description: "Auditing, secrets, and safe agent execution.",
    browseQuery: "security",
    statsLabel: "46 skills",
    growthLabel: "+36%",
  },
  {
    id: "coding-agents",
    title: "Coding agents",
    description: "Repo tools, reviews, and shipping automation.",
    browseQuery: "coding agent",
    statsLabel: "58 skills",
    growthLabel: "+51%",
  },
];

export const HOME_EDITORIAL_STACKS: HomeStack[] = [
  {
    id: "stack-peter",
    title: "Peter Steinberger's stack",
    description: "Install the skills Peter uses to run OpenClaw in production.",
    publisherHandle: "steipete",
    statsLabel: "24 skills",
    previews: [
      { title: "OpenClaw", meta: "Gateway + agent runtime" },
      { title: "Skill Creator", meta: "Scaffold and publish skills" },
      { title: "Convex", meta: "Backend patterns for agents" },
      { title: "GitHub", meta: "PR and repo automation" },
    ],
  },
  {
    id: "stack-nvidia",
    title: "NVIDIA AI stack",
    description: "Models, inference, and GPU workflows from NVIDIA builders.",
    publisherHandle: "nvidia",
    statsLabel: "18 skills",
    previews: [
      { title: "NIM", meta: "Inference microservices" },
      { title: "Riva", meta: "Speech and translation" },
      { title: "NeMo", meta: "LLM training toolkit" },
      { title: "CUDA", meta: "GPU development helpers" },
    ],
  },
];

export function getHomeStackHref(stack: HomeStack) {
  if (stack.publisherHandle) {
    return {
      to: "/user/$handle" as const,
      params: { handle: stack.publisherHandle },
    };
  }
  return {
    to: "/skills" as const,
    search: {
      q: stack.browseQuery,
      sort: "downloads" as const,
      dir: "desc" as const,
      highlighted: undefined,
      featured: undefined,
      category: undefined,
      view: undefined,
      focus: undefined,
    },
  };
}
