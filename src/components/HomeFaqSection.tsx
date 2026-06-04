import { Plus } from "lucide-react";
import { useState } from "react";
import { HOME_FAQ_ITEMS } from "../lib/homeFaq";

export function HomeFaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="home-v2-faq" aria-labelledby="home-v2-faq-title">
      <div className="home-v2-faq-inner">
        <header className="home-v2-faq-header">
          <h2 id="home-v2-faq-title" className="home-v2-faq-title">
            Common questions
          </h2>
          <p className="home-v2-faq-lede">
            Install, publish, and trust — the short version before you dive in.
          </p>
        </header>
        <div className="home-v2-faq-list">
          {HOME_FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`home-v2-faq-item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="home-v2-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`home-v2-faq-panel-${item.id}`}
                  id={`home-v2-faq-trigger-${item.id}`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="home-v2-faq-question">{item.question}</span>
                  <Plus size={18} className="home-v2-faq-icon" aria-hidden="true" />
                </button>
                <div
                  id={`home-v2-faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`home-v2-faq-trigger-${item.id}`}
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
    </section>
  );
}
