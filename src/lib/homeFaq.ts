export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    id: "what-is-clawhub",
    question: "What is ClawHub?",
    answer:
      "ClawHub is the public registry for OpenClaw skills and plugins. Browse versioned skill packs, gateway plugins, and security scan summaries before you install anything into your agent workspace.",
  },
  {
    id: "install",
    question: "How do I install a skill or plugin?",
    answer:
      "Use native OpenClaw commands: openclaw skills install <slug> for skills and openclaw plugins install clawhub:<package> for plugins. You can also install skills with the clawhub CLI into ./skills when you want a direct registry workflow.",
  },
  {
    id: "account",
    question: "Do I need an account to browse?",
    answer:
      "No. Public listings, search, and skill pages are open to everyone. Sign in when you want to publish, star skills, or manage your publisher profile.",
  },
  {
    id: "skills-vs-plugins",
    question: "What is the difference between skills and plugins?",
    answer:
      "Skills are text bundles centered on SKILL.md — playbooks and tools your agent reads. Plugins are OpenClaw gateway packages with compatibility metadata, installed as clawhub:<name> and validated against your gateway version.",
  },
  {
    id: "publish",
    question: "How do I publish to ClawHub?",
    answer:
      "Install the clawhub CLI, run clawhub login, then clawhub skill publish <path> for skills or clawhub package publish <source> for plugins. New releases stay private until automated security checks finish.",
  },
];
