import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FOOTER_ECOSYSTEM_PROJECTS,
  FOOTER_NAV_SECTIONS,
  FOOTER_PLATFORM_LINKS,
  type FooterEcosystemProject,
  OPENCLAW_CLAWHUB_DOCS_URL,
  OPENCLAW_ECOSYSTEM_URL,
  OPENCLAW_SITE_URL,
} from "../lib/nav-items";

const FOOTER_BRAND_MARK_SRC = "/og-clawhub-watermark.png";

function sectionId(title: string) {
  return `footer-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

const MOBILE_BREAKPOINT = 760;

function FooterEcoMark({ project }: { project: FooterEcosystemProject }) {
  const className = "footer-v2-eco-mark";
  const content = (
    <>
      <span className="footer-v2-eco-mark-logo" aria-hidden="true">
        <img src={project.logoUrl} alt="" width={28} height={28} decoding="async" />
      </span>
      <span className="footer-v2-eco-mark-label">{project.label}</span>
    </>
  );

  if (project.internal) {
    return (
      <Link to={project.href} className={className} title={project.blurb}>
        {content}
      </Link>
    );
  }

  return (
    <a className={className} href={project.href} target="_blank" rel="noreferrer" title={project.blurb}>
      {content}
    </a>
  );
}

export function Footer() {
  const [openSections, setOpenSections] = useState<ReadonlySet<string>>(() => new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      setIsMobile(false);
      return () => {};
    }

    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer site-footer-v2" role="contentinfo">
      <div className="site-footer-inner">
        <div className="footer-v2-main">
          <div className="footer-v2-brand">
            <Link to="/" className="footer-v2-brand-lockup">
              <img
                className="footer-v2-brand-mark"
                src={FOOTER_BRAND_MARK_SRC}
                alt=""
                width={22}
                height={22}
                decoding="async"
              />
              <span className="footer-v2-brand-name">ClawHub</span>
            </Link>
            <p className="footer-v2-brand-tagline">
              Skills and plugins for OpenClaw agents. Part of the wider OpenClaw ecosystem.
            </p>
            <a
              className="footer-v2-eco-link"
              href={OPENCLAW_CLAWHUB_DOCS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Explore docs
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <div className="footer-grid">
            {FOOTER_NAV_SECTIONS.map((section) => {
              const isOpen = openSections.has(section.title);
              const id = sectionId(section.title);
              const ariaExpanded = isMobile ? isOpen : true;

              return (
                <div key={section.title} className="footer-col">
                  <h4 className="footer-col-title">
                    <button
                      type="button"
                      className="footer-col-toggle"
                      aria-controls={`${id}-links`}
                      aria-expanded={ariaExpanded}
                      onClick={() => {
                        if (isMobile) toggleSection(section.title);
                      }}
                    >
                      <span>{section.title}</span>
                      <ChevronDown className="footer-col-toggle-icon" size={16} aria-hidden="true" />
                    </button>
                  </h4>
                  <div className="footer-col-links" id={`${id}-links`} data-open={isOpen}>
                    {section.items
                      .filter((item) => item.featureFlag !== false)
                      .map((item) => {
                        if (item.kind === "link") {
                          return (
                            <Link key={item.label} to={item.to} search={item.search ?? {}}>
                              {item.label}
                            </Link>
                          );
                        }
                        if (item.kind === "external") {
                          return (
                            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                              {item.label}
                            </a>
                          );
                        }
                        return <span key={item.label}>{item.label}</span>;
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="footer-v2-eco" aria-label="OpenClaw ecosystem">
          <a
            className="footer-v2-eco-label"
            href={OPENCLAW_ECOSYSTEM_URL}
            target="_blank"
            rel="noreferrer"
          >
            Built alongside
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <div className="footer-v2-eco-marks">
            {FOOTER_ECOSYSTEM_PROJECTS.map((project) => (
              <FooterEcoMark key={project.label} project={project} />
            ))}
            <a
              className="footer-v2-eco-mark footer-v2-eco-mark-all"
              href={OPENCLAW_ECOSYSTEM_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span className="footer-v2-eco-mark-label">All projects</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-v2-bottom">
          <p className="footer-v2-copy">
            © {year}{" "}
            <Link to="/" className="footer-v2-copy-link">
              ClawHub
            </Link>
            {" / "}
            <a
              className="footer-v2-copy-link"
              href={OPENCLAW_SITE_URL}
              target="_blank"
              rel="noreferrer"
            >
              an OpenClaw project
            </a>
          </p>
          <p className="footer-v2-meta">
            {FOOTER_PLATFORM_LINKS.map((link, index) => (
              <span key={link.label}>
                {index > 0 ? <span className="footer-v2-meta-sep" aria-hidden="true">·</span> : null}
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
