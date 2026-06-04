/** Curated app surfaces for the home “skills for your apps” grid (design-time). */

export type HomeApp = {
  id: string;
  name: string;
  description: string;
  /** Skills browse search query. */
  browseQuery: string;
  skillsLabel: string;
  /** Brand favicon via Google favicon helper (domain only). */
  iconDomain: string;
};

export const HOME_APPS: HomeApp[] = [
  {
    id: "chrome",
    name: "Google Chrome",
    description: "Browse, scrape, and automate the web from your agent.",
    browseQuery: "chrome browser",
    skillsLabel: "48 skills",
    iconDomain: "google.com",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post updates, triage channels, and run workflows in Slack.",
    browseQuery: "slack",
    skillsLabel: "36 skills",
    iconDomain: "slack.com",
  },
  {
    id: "vscode",
    name: "VS Code",
    description: "Edit repos, run tasks, and ship code from the editor.",
    browseQuery: "vscode",
    skillsLabel: "52 skills",
    iconDomain: "code.visualstudio.com",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Review PRs, manage issues, and automate repo workflows.",
    browseQuery: "github",
    skillsLabel: "64 skills",
    iconDomain: "github.com",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Read pages, update databases, and draft docs in Notion.",
    browseQuery: "notion",
    skillsLabel: "31 skills",
    iconDomain: "notion.so",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Create issues, sync cycles, and keep product work moving.",
    browseQuery: "linear",
    skillsLabel: "22 skills",
    iconDomain: "linear.app",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Export assets, comment on files, and sync design context.",
    browseQuery: "figma",
    skillsLabel: "19 skills",
    iconDomain: "figma.com",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Pair with your editor and run agent workflows in Cursor.",
    browseQuery: "cursor",
    skillsLabel: "27 skills",
    iconDomain: "cursor.com",
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Control playback, playlists, and listening from agents.",
    browseQuery: "spotify",
    skillsLabel: "14 skills",
    iconDomain: "spotify.com",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send messages, moderate servers, and automate communities.",
    browseQuery: "discord",
    skillsLabel: "18 skills",
    iconDomain: "discord.com",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Draft, triage, and send mail from agent workflows.",
    browseQuery: "gmail email",
    skillsLabel: "29 skills",
    iconDomain: "mail.google.com",
  },
  {
    id: "drive",
    name: "Google Drive",
    description: "Find files, sync folders, and share docs from Drive.",
    browseQuery: "google drive",
    skillsLabel: "21 skills",
    iconDomain: "drive.google.com",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Update tickets, sprints, and delivery status in Jira.",
    browseQuery: "jira",
    skillsLabel: "17 skills",
    iconDomain: "atlassian.com",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Chat, meetings, and handoffs inside Teams.",
    browseQuery: "microsoft teams",
    skillsLabel: "16 skills",
    iconDomain: "teams.microsoft.com",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Schedule calls, capture notes, and follow up after meetings.",
    browseQuery: "zoom",
    skillsLabel: "12 skills",
    iconDomain: "zoom.us",
  },
  {
    id: "aws",
    name: "AWS",
    description: "Operate cloud resources and deploy from agent playbooks.",
    browseQuery: "aws",
    skillsLabel: "33 skills",
    iconDomain: "aws.amazon.com",
  },
  {
    id: "raycast",
    name: "Raycast",
    description: "Launch commands, scripts, and quick actions on macOS.",
    browseQuery: "raycast",
    skillsLabel: "15 skills",
    iconDomain: "raycast.com",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Sync files, share links, and organize team storage.",
    browseQuery: "dropbox",
    skillsLabel: "11 skills",
    iconDomain: "dropbox.com",
  },
];

export function homeAppIconUrl(iconDomain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(iconDomain)}&sz=128`;
}

export const SKILLS_BROWSE_SEARCH = {
  q: undefined,
  sort: undefined,
  dir: undefined,
  highlighted: undefined,
  view: undefined,
  focus: undefined,
} as const;
