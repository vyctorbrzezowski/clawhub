const CLAWHUB_ORIGIN = "https://clawhub.ai";
const GITHUB_REPO = "https://github.com/openclaw/clawhub";

export function getClawHubHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${CLAWHUB_ORIGIN}/#organization`,
        name: "ClawHub",
        url: CLAWHUB_ORIGIN,
        logo: `${CLAWHUB_ORIGIN}/logo512.png`,
        sameAs: [GITHUB_REPO, "https://discord.gg/clawd"],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            url: `${GITHUB_REPO}/issues`,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${CLAWHUB_ORIGIN}/#website`,
        name: "ClawHub",
        url: CLAWHUB_ORIGIN,
        publisher: { "@id": `${CLAWHUB_ORIGIN}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${CLAWHUB_ORIGIN}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${CLAWHUB_ORIGIN}/#webpage`,
        name: "ClawHub",
        url: CLAWHUB_ORIGIN,
        isPartOf: { "@id": `${CLAWHUB_ORIGIN}/#website` },
        about: { "@id": `${CLAWHUB_ORIGIN}/#software` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-agent-summary]"],
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${CLAWHUB_ORIGIN}/#software`,
        name: "ClawHub",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: CLAWHUB_ORIGIN,
        codeRepository: GITHUB_REPO,
        license: `${GITHUB_REPO}/blob/main/LICENSE`,
        description:
          "Public registry for agent skills and OpenClaw plugins, with searchable metadata, artifact downloads, and token-authenticated publishing APIs.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          url: `${CLAWHUB_ORIGIN}/pricing.md`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${CLAWHUB_ORIGIN}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is ClawHub?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ClawHub is the public skill registry for OpenClaw: a place to publish, version, search, inspect, and install text-based agent skills and OpenClaw plugins.",
            },
          },
          {
            "@type": "Question",
            name: "Do agents need authentication to read ClawHub?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Public read endpoints do not require authentication. Publishing, ownership, moderation, and account workflows require ClawHub API tokens.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CLAWHUB_ORIGIN}/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ClawHub",
            item: CLAWHUB_ORIGIN,
          },
        ],
      },
    ],
  };
}
