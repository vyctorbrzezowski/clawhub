export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type HomeFaqGroup = {
  id: string;
  label: string;
  items: HomeFaqItem[];
};

export const HOME_FAQ_GROUPS: HomeFaqGroup[] = [
  {
    id: "claws",
    label: "Claws",
    items: [
      {
        id: "what-are-agent-skills",
        question: "What are Agent Skills?",
        answer:
          "Agent Skills are reusable instructions and support files that teach an AI assistant how to handle a specific task. A skill usually starts with SKILL.md and can include scripts, templates, examples, or domain notes.",
      },
      {
        id: "install",
        question: "How do I install an Agent Skill?",
        answer:
          "Open the listing, copy the install command, and run it in the workspace where your OpenClaw agent reads skills. Version history and scan state stay visible before install.",
      },
      {
        id: "safe",
        question: "Are these skills safe?",
        answer:
          "ClawHub surfaces publisher identity, version history, scanner results, and moderation state on listings. You should still review what a skill asks your agent to do before installing it.",
      },
      {
        id: "multiple-skills",
        question: "Can I use multiple skills together?",
        answer:
          "Yes. Skills can complement each other when their scopes are clear. Install the smallest set that matches your workflow so your agent gets useful context without unnecessary noise.",
      },
      {
        id: "skills-vs-plugins",
        question: "What is the difference between skills and plugins?",
        answer:
          "Skills are text bundles centered on SKILL.md — playbooks and tools your agent reads. Plugins are OpenClaw gateway packages with compatibility metadata, installed as clawhub:<name> and validated against your gateway version.",
      },
      {
        id: "slash-commands",
        question: "How are skills different from slash commands?",
        answer:
          "Slash commands trigger a specific action. Skills give the agent reusable operating context, examples, and supporting files so it can handle a class of tasks more reliably.",
      },
      {
        id: "updates",
        question: "How often are skills updated?",
        answer:
          "Each publisher controls their release cadence. ClawHub keeps version history visible so you can see when a skill changed before you upgrade.",
      },
      {
        id: "affiliation",
        question: "Is this site affiliated with Anthropic or OpenAI?",
        answer:
          "ClawHub is an OpenClaw project. It catalogs skills and plugins that can support different agent environments, but it is not an official Anthropic or OpenAI product.",
      },
    ],
  },
  {
    id: "creators",
    label: "Publishers",
    items: [
      {
        id: "account",
        question: "Do I need an account to browse?",
        answer:
          "No. Public listings, search, and skill pages are open to everyone. Sign in when you want to publish, star skills, or manage your publisher profile.",
      },
      {
        id: "publish",
        question: "How do I publish to ClawHub?",
        answer:
          "Install the clawhub CLI, run clawhub login, then clawhub skill publish <path> for skills or clawhub package publish <source> for plugins. New releases stay private until automated security checks finish.",
      },
      {
        id: "publisher-profile",
        question: "What shows up on my publisher profile?",
        answer:
          "Your public profile groups published skills, plugins, install activity, and basic trust signals so users can understand who maintains what before they install.",
      },
    ],
  },
  {
    id: "orgs",
    label: "Orgs",
    items: [
      {
        id: "org-packages",
        question: "Can an org publish shared plugins?",
        answer:
          "Yes. Org-owned packages can represent official gateway plugins, internal tooling surfaces, or maintained skill collections with one public owner identity.",
      },
      {
        id: "security",
        question: "How does ClawHub help with trust?",
        answer:
          "Listings keep scan summaries, version history, ownership, and moderation state visible on the page, so teams do not need to inspect a README to find the risk context.",
      },
      {
        id: "migration",
        question: "Can we move from one publisher to an org?",
        answer:
          "Yes. Preserve the public package identity where possible, then transfer ownership so installs, versions, and trust history keep pointing at the maintained surface.",
      },
    ],
  },
];
