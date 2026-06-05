import { Plus } from "lucide-react";
import { useState } from "react";
import { HOME_FAQ_GROUPS } from "../lib/homeFaq";
import { FOOTER_NAV_SECTIONS } from "../lib/nav-items";

const DISCORD_URL =
  FOOTER_NAV_SECTIONS.find((section) => section.title === "Community")?.items.find(
    (item) => item.kind === "external" && item.label === "Discord",
  )?.href ?? "https://discord.gg/clawd";

export function HomeFaqSection() {
  const [activeGroupId, setActiveGroupId] = useState(HOME_FAQ_GROUPS[0]?.id ?? "");
  const [openId, setOpenId] = useState<string | null>(null);
  const activeGroup =
    HOME_FAQ_GROUPS.find((group) => group.id === activeGroupId) ??
    HOME_FAQ_GROUPS[0] ?? { id: "", label: "", items: [] };

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="home-v2-faq" aria-labelledby="home-v2-faq-title">
      <div className="home-v2-faq-inner">
        <header className="home-v2-faq-header">
          <span className="home-v2-faq-kicker">
            <img src="/og-clawhub-watermark.png" alt="" width={18} height={18} decoding="async" />
            You may ask...
          </span>
          <h2 id="home-v2-faq-title" className="home-v2-faq-title">
            Common questions
          </h2>
          <a className="home-v2-faq-discord" href={DISCORD_URL} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join the community
          </a>
        </header>
        <div className="home-v2-faq-body">
          <nav className="home-v2-faq-groups" aria-label="FAQ groups">
            {HOME_FAQ_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`home-v2-faq-group${group.id === activeGroupId ? " is-active" : ""}`}
                aria-pressed={group.id === activeGroupId}
                onClick={() => {
                  setActiveGroupId(group.id);
                  setOpenId(null);
                }}
              >
                {group.label}
              </button>
            ))}
          </nav>
          <div className="home-v2-faq-list">
            {activeGroup.items.map((item) => {
              const panelId = `home-v2-faq-panel-${activeGroup.id}-${item.id}`;
              const triggerId = `home-v2-faq-trigger-${activeGroup.id}-${item.id}`;
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={`home-v2-faq-item${isOpen ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="home-v2-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={triggerId}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="home-v2-faq-question">{item.question}</span>
                    <Plus size={18} className="home-v2-faq-icon" aria-hidden="true" />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="home-v2-faq-panel"
                    hidden={!isOpen}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
