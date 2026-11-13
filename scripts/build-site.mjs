import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://edgedashpro.com";
const CHECKOUT = "https://app.edgedashpro.com/pricing";
const DISCLAIMER =
  "EdgeDashPro is not investment advice. Trading involves risk of loss. Past results do not guarantee future results.";
const MAILTO =
  "mailto:hello@edgedashpro.com?subject=" +
  encodeURIComponent("EdgeDashPro — request access");
const LOCK =
  "Every free public view is locked server-side to $1–$50 only and float under 40M. Signals is locked to Price Spike Up and Price Spike Down at 5% on those stocks. Free visitors see only those locked presets. They cannot change or customize filters. Interactive filter controls and saved filter presets are paid.";
const DATA =
  "This site does not describe the data as universally connected or real-time. A delayed quote can wear a delayed tag. A cached value can wear a cached tag. A field with no feed stays n/a. A panel without a connected feed stays grey, and a feed that is failing stays marked that way.";

const NAV = [
  ["features", "Features"],
  ["market", "Market"],
  ["journal", "Journal"],
  ["research", "Research"],
  ["faq", "FAQ"]
];

const FOOTER = [
  ["", "Home"],
  ["features", "Features"],
  ["market", "Market"],
  ["journal", "Journal"],
  ["research", "Research"],
  ["access", "Pricing"],
  ["faq", "FAQ"],
  ["support", "Support"],
  ["contact", "Contact"],
  ["privacy", "Privacy"],
  ["terms", "Terms"],
  ["sitemap", "Site map"]
];

function prefix(file) {
  return "../".repeat(file.split("/").length - 1);
}

function href(file, slug) {
  const pre = prefix(file);
  if (!slug) return pre || "./";
  return `${pre}${slug}/`;
}

function canonical(slug, file) {
  if (file === "404.html") return `${BASE}/404.html`;
  if (!slug) return `${BASE}/`;
  return `${BASE}/${slug}/`;
}

function shot(title, caption) {
  return `<figure class="shot">
    <div class="shot-frame">
      <div class="shot-chrome"><span class="shot-badge">Screenshot slot</span></div>
      <div class="shot-body">
        <p class="shot-kicker">App image to be added later</p>
        <p class="shot-title">${title}</p>
      </div>
    </div>
    <figcaption>${caption} This frame is a placeholder, not a capture of the app.</figcaption>
  </figure>`;
}

const faq = [
  {
    q: "What is EdgeDashPro?",
    a: "EdgeDashPro is a web desk for people who trade their own plan. The tagline is Your rules. Your data. Your desk. Launch is two tiers: a free public tier, and a paid tier for a user account."
  },
  {
    q: "Is EdgeDashPro investment advice?",
    a: DISCLAIMER + " Nothing on this website is a recommendation to buy or sell. The desk is a process tool. It does not publish customer results."
  },
  {
    q: "What is on the free public tier?",
    a: "The free public tier is $0. It does not require a login, and it is ad-supported. It is read-only: Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research. " + LOCK + " Browser-based Squawk is not on those pages."
  },
  {
    q: "What can I change on Signals and the other free views?",
    a: LOCK + " Paid is $29.99/month or $259/year, with no free trial of the subscription, and that is what unlocks the interactive filter controls."
  },
  {
    q: "How does the Squawk trial work?",
    a: "Free users must create a free account to access the 7-day Squawk trial. That account unlocks browser-based Squawk for the first 7 days. Market, News, JAMSEC, Dilution, Stock Card, and Research stay on the free tier with no login. After 7 days, Squawk requires the paid tier at $29.99/month or $259/year, and paid Squawk is ad-free. The 7-day window is only for Squawk. The paid subscription has no free trial and goes straight to Stripe Checkout."
  },
  {
    q: "What does the paid tier unlock?",
    a: "Paid is $29.99/month or $259/year. It is a 25-user launch with no free trial of the subscription. Checkout goes straight to Stripe. Paid unlocks the interactive filter controls, custom filtering, saved filter presets, the journal, and ad-free Squawk. Each of those is scoped to the user account. Free visitors cannot change the locked presets. Ad-free Squawk is what you need after the first 7 days. The journal is a unified trade journal, a profit and loss calendar, and post-trade insight cards and reviews."
  },
  {
    q: "Are the data feeds real-time and always connected?",
    a: "No. " + DATA
  },
  {
    q: "Will the desk place trades for me?",
    a: "No. You use the desk yourself. EdgeDashPro does not buy or sell for you. It is not a brokerage. This website does not offer a service that buys or sells for you."
  },
  {
    q: "How do I get access, and what does it cost?",
    a: "The free public tier is $0 and needs no checkout. Paid Monthly is $29.99/month and Paid Annual is $259/year, with no free trial of the subscription. Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing, straight to Stripe Checkout. The paid launch holds 25 users. The waitlist button emails hello@edgedashpro.com."
  },
  {
    q: "Does the free tier show ads?",
    a: "Yes. The free public pages are ad-supported. Browser-based Squawk is a 7-day trial on a free account, not a no-login page. After 7 days, Squawk requires Paid and is ad-free. The paid subscription has no free trial. Terms, Privacy, and the risk disclosure apply."
  },
  {
    q: "How do I reach support?",
    a: "Email hello@edgedashpro.com. Say what you were doing and what you expected. Do not send account numbers, passwords, or API keys. This site does not promise a response time."
  },
  {
    q: "Does the automated assistant send my question anywhere?",
    a: "No. The automated assistant runs in your browser and answers from the text of this website only. It does not contact an outside service."
  }
];

function faqHtml() {
  return `<div class="faq">${faq
    .map(
      (item) => `<details>
      <summary>${item.q}</summary>
      <p>${item.a}</p>
    </details>`
    )
    .join("")}</div>`;
}

function layout(page) {
  const pre = prefix(page.file);
  const url = canonical(page.slug, page.file);
  const nav = NAV.map(([slug, label]) => {
    const current = slug === page.slug ? ' aria-current="page"' : "";
    return `<a href="${href(page.file, slug)}"${current}>${label}</a>`;
  }).join("");
  const footer = FOOTER.map(
    ([slug, label]) => `<li><a href="${href(page.file, slug)}">${label}</a></li>`
  ).join("");
  const crumbs =
    page.slug && page.file !== "404.html"
      ? `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><ol>
          <li><a href="${href(page.file, "")}">Home</a></li>
          <li>${page.crumb}</li>
        </ol></nav></div>`
      : "";
  const graph = [
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": BASE + "/#website" },
      about: { "@id": BASE + "/#org" },
      inLanguage: "en"
    }
  ];
  if (!page.slug && page.file !== "404.html") {
    graph.push(
      {
        "@type": "WebSite",
        "@id": BASE + "/#website",
        url: BASE + "/",
        name: "EdgeDashPro",
        description: page.description,
        publisher: { "@id": BASE + "/#org" },
        inLanguage: "en"
      },
      {
        "@type": "Organization",
        "@id": BASE + "/#org",
        name: "EdgeDashPro",
        url: BASE + "/",
        email: "hello@edgedashpro.com",
        slogan: "Your rules. Your data. Your desk.",
        logo: BASE + "/assets/img/logo.svg"
      },
      {
        "@type": "SoftwareApplication",
        name: "EdgeDashPro",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: BASE + "/",
        description:
          "Free public pages need no login and stay on locked presets: $1–$50, float under 40M, and Price Spike Up or Price Spike Down at 5% on Signals. A free account unlocks browser-based Squawk for the first 7 days. Paid is $29.99 a month or $259 a year, with no free trial of the subscription, and adds interactive filter controls, saved filter presets, the journal, and ad-free Squawk. Not investment advice.",
        offers: [
          {
            "@type": "Offer",
            name: "Free public",
            price: "0",
            priceCurrency: "USD",
            description: "Ad-supported. No login. Read-only."
          },
          {
            "@type": "Offer",
            name: "Paid Monthly",
            price: "29.99",
            priceCurrency: "USD",
            description: "Per account. No free trial."
          },
          {
            "@type": "Offer",
            name: "Paid Annual",
            price: "259",
            priceCurrency: "USD",
            description: "Per account. No free trial."
          }
        ]
      }
    );
  } else if (page.file !== "404.html") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: page.crumb, item: url }
      ]
    });
  }
  if (page.extraGraph) graph.push(...page.extraGraph);
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  const robots = page.robots || "index, follow";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#07142e">
  <meta property="og:site_name" content="EdgeDashPro">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE}/assets/img/og.png">
  <meta property="og:image:alt" content="EdgeDashPro mark on navy, with the tagline Your rules. Your data. Your desk.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <meta name="twitter:image" content="${BASE}/assets/img/og.png">
  <link rel="icon" href="${pre}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${pre}assets/img/apple-touch-icon.png">
  <link rel="manifest" href="${pre}site.webmanifest">
  <link rel="stylesheet" href="${pre}assets/css/site.css">
  <script type="application/ld+json">${json}</script>
</head>
<body data-root="${pre}">
  <a class="skip" href="#content">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="${href(page.file, "")}">
        <img src="${pre}assets/img/mark.svg" alt="" width="132" height="48">
        <span class="brand-name">EdgeDashPro</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary">
        ${nav}
        <a class="btn btn-primary header-cta" href="${href(page.file, "access")}">Pricing</a>
      </nav>
    </div>
  </header>
  <main id="content">
    ${crumbs}
    ${page.body}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <p class="disclaimer"><strong>Risk.</strong> ${DISCLAIMER}</p>
      <div class="footer-grid">
        <p class="fine" style="margin:0">EdgeDashPro · Your rules. Your data. Your desk.</p>
        <ul class="footer-links">${footer}</ul>
      </div>
      <p class="legal-note">Public pages are $0, with no login, and ad-supported. A free account unlocks browser-based Squawk for the first 7 days. After that, Squawk requires Paid. Paid is $29.99 a month or $259 a year, a 25-user launch, with no free trial of the subscription. Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing, straight to Stripe Checkout. The waitlist button emails hello@edgedashpro.com. Screenshot frames are placeholders. © 2026 EdgeDashPro.</p>
    </div>
  </footer>
  <div class="assistant">
    <div id="assistant-panel" class="assistant-panel" role="dialog" aria-labelledby="assistant-title" aria-modal="true" hidden>
      <div class="assistant-head">
        <div>
          <h2 id="assistant-title">Automated assistant</h2>
          <p>This automated assistant answers from this website only. It does not contact an outside service, and it does not place trades.</p>
        </div>
        <button class="assistant-close" type="button">Close</button>
      </div>
      <div class="assistant-log" aria-live="polite"></div>
      <div class="suggest">
        <button type="button" data-suggest="What is on the free tier?">Free tier</button>
        <button type="button" data-suggest="Is this investment advice?">Is this investment advice?</button>
        <button type="button" data-suggest="What does the paid tier include?">Paid tier</button>
        <button type="button" data-suggest="How much does it cost?">Pricing</button>
      </div>
      <form class="assistant-form">
        <label class="sr-only" for="assistant-q">Your question</label>
        <input id="assistant-q" name="q" type="text" autocomplete="off" placeholder="Ask about the desk">
        <button type="submit">Send</button>
      </form>
    </div>
    <button class="assistant-toggle" type="button" aria-expanded="false" aria-controls="assistant-panel">
      <small>Ask</small>
      <strong>Automated assistant</strong>
    </button>
  </div>
  <script src="${pre}assets/js/checkout-config.js"></script>
  <script src="${pre}assets/js/assistant-knowledge.js"></script>
  <script src="${pre}assets/js/site.js"></script>
</body>
</html>
`;
}

const pages = [];

pages.push({
  file: "index.html",
  slug: "",
  crumb: "Home",
  title: "EdgeDashPro — Your rules. Your data. Your desk.",
  description:
    "EdgeDashPro: free public pages at $0 with no login, a 7-day Squawk trial on a free account, and paid at $29.99 a month or $259 a year with no free trial of the subscription. Not investment advice.",
  body: `<div class="wrap">
    <section class="hero">
      <img class="hero-logo" src="assets/img/logo.svg" alt="EdgeDashPro monogram: a lowercase e beside uppercase D and P, cut by a blue diagonal slash.">
      <h1>EdgeDashPro</h1>
      <p class="tagline">Your rules. Your data. Your desk.</p>
      <p class="lede">Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research are free, ad-supported, and read-only, with no login. Those views stay on locked presets: $1–$50, float under 40M, and Price Spike Up or Price Spike Down at 5% on Signals. A free account unlocks browser-based Squawk for the first 7 days. Paid unlocks the interactive filter controls, saved filter presets, the journal, and ad-free Squawk. The paid subscription has no free trial.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="access/">See pricing</a>
        <a class="btn btn-ghost" href="features/">See what is on the desk</a>
      </div>
      <p class="fine">Public pages $0, no login. Squawk needs a free account and lasts 7 days. Paid $29.99/month or $259/year. 25-user launch. No free trial of the subscription.</p>
      <p class="mark-note">The eDP monogram is the brand mark. This site does not publish performance.</p>
    </section>
    <section class="section" aria-labelledby="tiers-heading">
      <p class="kicker">Launch</p>
      <h2 id="tiers-heading">Two tiers</h2>
      <p class="section-intro">Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research do not require a login. Filters on those views cannot be changed. Squawk needs a free account and lasts 7 days. Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing, straight to Stripe Checkout, with no free trial of the subscription.</p>
      <div class="card-grid">
        <article class="card">
          <p class="tier-note">Free public</p>
          <h3>Ad-supported</h3>
          <p class="price">$0</p>
          <p>No login for Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research. Read-only. ${LOCK} Squawk is not included on these pages. Standard Terms, Privacy, and the risk disclosure apply.</p>
        </article>
        <article class="card">
          <p class="tier-note">Paid monthly</p>
          <h3>Per account</h3>
          <p class="price">$29.99 <span>/ month</span></p>
          <p>Interactive filter controls, custom filtering, saved filter presets, the journal, and ad-free Squawk after the 7-day Squawk trial. No free trial of the subscription.</p>
        </article>
        <article class="card">
          <p class="tier-note">Paid annual</p>
          <h3>Per account</h3>
          <p class="price">$259 <span>/ year</span></p>
          <p>The same paid unlocks, billed once a year. The launch holds 25 paid users.</p>
        </article>
      </div>
    </section>
    <section class="section" aria-labelledby="today-heading">
      <p class="kicker">Free public</p>
      <h2 id="today-heading">On the desk without a login</h2>
      <p class="section-intro">These pages are included at $0. A field with no feed stays n/a.</p>
      <div class="card-grid">
        <article class="card">
          <h3><a href="market/">Market</a></h3>
          <p>Index cards, headlines, and sector context. A context pill is not a signal. A delayed or cached quote is tagged.</p>
        </article>
        <article class="card">
          <h3><a href="features/#news">News</a></h3>
          <p>A reader for the feed summary, a Why It's Moving note, and a link to the original.</p>
        </article>
        <article class="card">
          <h3><a href="features/#jamsec">JAMSEC</a></h3>
          <p>A read-only public page. It uses the same $1–$50 and float under 40M lock. It is not a trading signal and it is not advice.</p>
        </article>
        <article class="card">
          <h3><a href="features/#signals">Signals</a></h3>
          <p>Locked to Price Spike Up and Price Spike Down at 5%, on stocks from $1–$50 with float under 40M. The preset cannot be changed.</p>
        </article>
        <article class="card">
          <h3><a href="research/#dilution">Dilution</a></h3>
          <p>A dilution scorecard with a risk bar, a score from 0 to 100, and a PDF download.</p>
        </article>
        <article class="card">
          <h3><a href="research/#stock-card">Stock Card</a></h3>
          <p>A read-only card for the symbol you open. Cells without a feed stay grey or n/a.</p>
        </article>
        <article class="card">
          <h3><a href="research/">Research</a></h3>
          <p>Read-only research notes. This site does not publish the outcome of a study.</p>
        </article>
        <article class="card">
          <h3><a href="features/#filters">Locked presets</a></h3>
          <p>Free visitors see only the locked presets. They cannot change or customize filters. Interactive filter controls are paid.</p>
        </article>
      </div>
    </section>
    <section class="section">
      <div class="band">
        <h2>Squawk for the first 7 days</h2>
        <p>Browser-based Squawk is not on the no-login pages. Free users must create a free account to access the 7-day Squawk trial. After 7 days, Squawk requires the paid tier and is ad-free. That window is only for Squawk. The paid subscription has no free trial. <a href="features/#squawk">Squawk details</a></p>
      </div>
      <div class="band">
        <h2>What paid adds</h2>
        <p>Paid unlocks the interactive filter controls, custom filtering, saved filter presets, the journal, and ad-free Squawk. The journal is a unified trade journal, a P&amp;L calendar, and post-trade insight cards and reviews. All of that is scoped per user account. <a href="access/">Pricing and access</a></p>
      </div>
    </section>
    <section class="section">
      <div class="band">
        <h2>How the desk treats missing data</h2>
        <p>${DATA}</p>
      </div>
    </section>
    <section class="section" aria-labelledby="shots-heading">
      <h2 id="shots-heading">App images</h2>
      <p class="section-intro">Screenshots of the desk are not on this site yet. The frames below are reserved and captioned.</p>
      <div class="shot-grid">
        ${shot("Market", "Placeholder for a later image of the market view. Not a performance chart.")}
        ${shot("Squawk trial", "Placeholder for a later image of browser-based Squawk. A free account is required, and the trial lasts 7 days.")}
        ${shot("Dilution and Stock Card", "Placeholder for a later image of the research cards. Figures in a future image are sample data.")}
        ${shot("Paid journal", "Placeholder for a later image of the trade journal, the P&amp;L calendar, and a post-trade insight card.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "features/index.html",
  slug: "features",
  crumb: "Features",
  title: "Features — EdgeDashPro",
  description:
    "Free public pages need no login: Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research. Signals is locked to a 5% price spike on $1–$50 names with float under 40M. Custom filters are paid. A free account unlocks Squawk for the first 7 days.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Launch</p>
      <h1>Features</h1>
      <p class="lede" style="margin-left:0">Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research are $0, need no login, and are ad-supported. Every free view is locked to $1–$50 and float under 40M. Signals is locked to Price Spike Up and Price Spike Down at 5%. Visitors cannot change those filters. A free account unlocks browser-based Squawk for the first 7 days. Paid is $29.99/month or $259/year, a 25-user launch, with no free trial of the subscription. Nothing here is a performance claim.</p>
    </header>
    <article class="prose">
      <h2>Free public tier</h2>
      <p>Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research are a strict read-only experience. You do not sign in for those pages. Standard <a href="../terms/">Terms</a>, <a href="../privacy/">Privacy</a>, and the risk disclosure apply. ${DISCLAIMER}</p>
      <h2 id="market">Market</h2>
      <p>Market is a public page: index cards, market headlines, a theme heat map, a sector ETF heat map, and industry tiles for pharma, biotech, semiconductors, regional banks, oil and gas, and gold miners. A bull and bear ETF tape sits with them. A tile can show Favors shorts, Favors longs, or Neutral. That pill is context, not a signal. A change under half a percent reads Neutral. Bear funds flip the read, because a rise in the bear fund means the sector is falling.</p>
      <p>A tile can show a delayed tag when the quote is delayed, or a cached tag when the value is cached. <a href="../market/">Market page</a></p>
      <h2 id="news">News</h2>
      <p>News is a public page. A headline opens a reader with the feed summary, a Why It's Moving note, and a link to the original. The free tier does not add custom news filters. A field with no feed stays n/a.</p>
      <h2 id="jamsec">JAMSEC</h2>
      <p>JAMSEC is a public page on the free desk. It is read-only and uses the same $1–$50 and float under 40M lock as the rest of that tier. A field with no feed stays n/a. This site does not describe JAMSEC as a trading signal or as advice.</p>
      <h2 id="signals">Signals</h2>
      <p>Signals is a free public page. It is locked to Price Spike Up and Price Spike Down at 5%, and only on stocks from $1–$50 with float under 40M. The same $1–$50 and float under 40M lock applies on every free public view. A free visitor cannot change that preset. A price spike on this page is not investment advice. A field with no feed stays n/a, and a delayed or cached value can wear that tag.</p>
      <h2 id="research">Dilution, Stock Card, and Research</h2>
      <p>Dilution, Stock Card, and Research are public, read-only pages. Dilution can show a risk bar and a score from 0 to 100, with offering math, and a PDF download. The stock card shows the symbol you open. Research notes stay on the page. Cells without a feed stay grey or n/a. A connected feed that is failing stays marked as failing. <a href="../research/">Research page</a></p>
      <h2 id="squawk">Browser-based Squawk</h2>
      <p>Squawk is not one of the no-login pages. Free users must create a free account to access the 7-day Squawk trial. That account unlocks browser-based Squawk for the first 7 days. Squawk can be switched on or off, with a volume control, and it reads chosen headlines and market alerts. It does not read a feed that is missing as if the item were present.</p>
      <p>After 7 days, Squawk requires the paid tier at $29.99/month or $259/year, and paid Squawk is ad-free, scoped to the user account. The 7-day window is only for Squawk. The paid subscription has no free trial.</p>
      <h2 id="filters">Locked presets</h2>
      <p>${LOCK} The lock is applied on the server. The free desk does not offer a control that changes the price band, the float band, or the 5% spike preset, and it does not save a preset.</p>
      <h2 id="paid">Paid tier</h2>
      <p>Paid Monthly is $29.99/month. Paid Annual is $259/year. There is no free trial of the subscription. Continue to Paid Monthly and Continue to Paid Annual open <a href="${CHECKOUT}">https://app.edgedashpro.com/pricing</a>, straight to Stripe Checkout. The paid launch holds 25 users. The waitlist button emails hello@edgedashpro.com.</p>
      <p>Paid unlocks three things, each scoped per user account:</p>
      <ul>
        <li>Interactive filter controls, custom filtering, and saved filter presets.</li>
        <li>The journal: a unified trade journal, a P&amp;L calendar, and post-trade insight cards and reviews. See the <a href="../journal/">journal page</a>.</li>
        <li>Ad-free Squawk, required after the first 7 days.</li>
      </ul>
      <div class="callout">
        <p>${DATA}</p>
      </div>
    </article>
    <section class="section" aria-labelledby="feature-shots">
      <h2 id="feature-shots">Screenshot slots</h2>
      <div class="shot-grid">
        ${shot("Market", "Placeholder for a later image of index cards and sector context. Not a performance chart.")}
        ${shot("News", "Placeholder for a later image of the news reader.")}
        ${shot("JAMSEC", "Placeholder for a later image of JAMSEC. Not a signal board.")}
        ${shot("Signals", "Placeholder for a later image of Price Spike Up and Price Spike Down at 5%. The preset is locked.")}
        ${shot("Squawk trial", "Placeholder for a later image of browser-based Squawk. A free account is required, and access lasts 7 days.")}
        ${shot("Dilution and Stock Card", "Placeholder for a later image of the research cards. Figures in a future image are sample data.")}
        ${shot("Paid journal", "Placeholder for a later image of the journal, the P&amp;L calendar, and an insight card.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "market/index.html",
  slug: "market",
  crumb: "Market",
  title: "Market — EdgeDashPro",
  description:
    "The EdgeDashPro market page is free and read-only. Filters are locked server-side to $1–$50 only and float under 40M. Delayed and cached quotes are tagged.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Free public · read-only</p>
      <h1>Market</h1>
      <p class="lede" style="margin-left:0">Market is on the free public tier. No login. The view is context, not a signal, and not a record of results.</p>
    </header>
    <article class="prose">
      <h2>What the page shows</h2>
      <p>Market stacks index cards, market headlines, a theme heat map, a sector ETF heat map, and industry tiles for pharma, biotech, semiconductors, regional banks, oil and gas, and gold miners. A bull and bear ETF tape sits with them.</p>
      <p>A tile can show Favors shorts, Favors longs, or Neutral. That pill is context, not a signal. A change under half a percent reads Neutral. Bear funds flip the read, because a rise in the bear fund means the sector is falling.</p>
      <h2>Tags, and fields that stay n/a</h2>
      <p>${DATA}</p>
      <h2 id="filters">The filter lock</h2>
      <p>${LOCK} Names outside that band are not opened up from the browser on the free tier.</p>
      <p>Interactive filter controls, custom filtering, and saved filter presets are paid, and they are stored on the user account. <a href="../access/">See pricing</a>.</p>
      <div class="callout"><p>${DISCLAIMER}</p></div>
    </article>
    <section class="section">
      <div class="shot-grid">
        ${shot("Market context", "Placeholder for a later image of index cards, headlines, and sector tiles. Not a performance chart.")}
        ${shot("Delayed and cached tags", "Placeholder for a later image showing a delayed tag or a cached tag, and n/a where a feed is missing.")}
        ${shot("Locked filters", "Placeholder for a later image of the read-only $1–$50 and float under 40M filter state.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "journal/index.html",
  slug: "journal",
  crumb: "Journal",
  title: "Trade Journal — EdgeDashPro",
  description:
    "The EdgeDashPro journal is paid: a unified trade journal, a profit and loss calendar, and post-trade insight cards, scoped to the user account. Not investment advice.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Paid · per account</p>
      <h1>Journal</h1>
      <p class="lede" style="margin-left:0">The journal is a paid unlock. It is not on the free public tier. It is scoped to the user account.</p>
    </header>
    <article class="prose">
      <h2>What the paid journal includes</h2>
      <ul>
        <li>A unified trade journal of the trades you record.</li>
        <li>A P&amp;L calendar of those rows.</li>
        <li>Post-trade insight cards and reviews: what you planned, what you did, and what you would repeat.</li>
      </ul>
      <p>Paid Monthly is $29.99/month and Paid Annual is $259/year, with no free trial of the subscription. The same account holds custom filtering, saved filter presets, and ad-free Squawk. Browser-based Squawk before that is a 7-day trial on a free account, not a trial of this journal. <a href="../access/">Pricing and access</a></p>
      <p>The journal stores the row you write. This website does not turn those rows into a public track record, a win rate, or a promise about the next trade.</p>
      <div class="callout"><p>${DISCLAIMER}</p></div>
    </article>
    <section class="section">
      <div class="shot-grid">
        ${shot("Unified trade journal", "Placeholder for a later image of the paid journal. Not a results report.")}
        ${shot("P&amp;L calendar", "Placeholder for a later image of the profit and loss calendar. Sample figures only, when an image is added.")}
        ${shot("Post-trade insight card", "Placeholder for a later image of an insight card and a written review after a trade.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "research/index.html",
  slug: "research",
  crumb: "Research",
  title: "Research — EdgeDashPro",
  description:
    "Free public Dilution, Stock Card, and Research pages on EdgeDashPro. Read-only. Fields without a feed stay n/a. Not investment advice.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Free public · read-only</p>
      <h1>Research</h1>
      <p class="lede" style="margin-left:0">Dilution, Stock Card, and Research are on the free public tier. No login. A page of research is not a recommendation.</p>
    </header>
    <div class="split">
      <article class="prose">
        <h2 id="dilution">Dilution</h2>
        <p>The dilution scorecard can show a risk bar and a score from 0 to 100, with offering math. Download a PDF of the card. A field with no feed stays n/a.</p>
        <h2 id="stock-card">Stock Card</h2>
        <p>The stock card is the read-only card for the symbol you open. Cells without a feed stay grey. A connected feed that is failing stays marked as failing.</p>
        <h2 id="notes">Research notes</h2>
        <p>Research can hold a short case, a squeeze case, and a plan. This site does not publish the outcome of any study. ${LOCK}</p>
        <div class="callout"><p>${DISCLAIMER}</p></div>
      </article>
      <aside class="panel card">
        <h2>Tags</h2>
        <p>${DATA}</p>
        <p>Interactive filter controls and any saved preset belong to the paid account. The free pages stay on the locked presets, including Price Spike Up and Price Spike Down at 5% on Signals.</p>
      </aside>
    </div>
    <section class="section">
      <div class="shot-grid">
        ${shot("Dilution scorecard", "Placeholder for a later image of the dilution risk bar and score. Sample figures only, when an image is added.")}
        ${shot("Stock Card", "Placeholder for a later image of the stock card, with n/a where a feed is missing.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "access/index.html",
  slug: "access",
  crumb: "Pricing",
  title: "Pricing and Access — EdgeDashPro",
  description:
    "EdgeDashPro pricing: free public tier $0, Paid Monthly $29.99/month, or Paid Annual $259/year. 25-user launch. No free trial. Paid buttons open https://app.edgedashpro.com/pricing.",
  extraGraph: [
    {
      "@type": "Product",
      name: "EdgeDashPro",
      description: "Free public tier and paid tier. Not investment advice.",
      brand: { "@type": "Brand", name: "EdgeDashPro" },
      offers: [
        {
          "@type": "Offer",
          name: "Free public",
          price: "0",
          priceCurrency: "USD",
          url: BASE + "/access/"
        },
        {
          "@type": "Offer",
          name: "Paid Monthly",
          price: "29.99",
          priceCurrency: "USD",
          url: BASE + "/access/"
        },
        {
          "@type": "Offer",
          name: "Paid Annual",
          price: "259",
          priceCurrency: "USD",
          url: BASE + "/access/"
        }
      ]
    }
  ],
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Pricing</p>
      <h1>Pricing and access</h1>
      <p class="lede" style="margin-left:0">Public pages are free and need no login. Every free view is locked to $1–$50 and float under 40M, and Signals is locked to Price Spike Up and Price Spike Down at 5%. Visitors cannot change those filters. A free account unlocks browser-based Squawk for the first 7 days. After that, Squawk requires Paid and is ad-free. Continue to Paid Monthly ($29.99/month) and Continue to Paid Annual ($259/year) open https://app.edgedashpro.com/pricing, straight to Stripe Checkout, with no free trial of the subscription. The paid launch holds 25 users. The waitlist button emails hello@edgedashpro.com.</p>
    </header>
    <div class="card-grid">
      <article class="card">
        <p class="tier-note">Free public</p>
        <h2>Ad-supported</h2>
        <p class="price">$0</p>
        <p>No login and no checkout for these pages. Read-only, and ad-supported.</p>
        <ul class="plan-list">
          <li>Market, News, JAMSEC, and Signals</li>
          <li>Dilution, Stock Card, and Research</li>
          <li>${LOCK}</li>
          <li>Browser-based Squawk is not included here. A free account unlocks it for the first 7 days.</li>
        </ul>
        <p>Standard <a href="../terms/">Terms</a>, <a href="../privacy/">Privacy</a>, and the risk disclosure apply. ${DISCLAIMER}</p>
      </article>
      <article class="card">
        <p class="tier-note">Paid monthly</p>
        <h2>Per account</h2>
        <p class="price">$29.99 <span>/ month</span></p>
        <p>Straight to Stripe Checkout. No free trial. Paid Monthly is $29.99/month.</p>
        <ul class="plan-list">
          <li>Interactive filter controls, custom filtering, and saved filter presets</li>
          <li>Journal: unified trade journal, P&amp;L calendar, and post-trade insight cards</li>
          <li>Ad-free Squawk, required after the first 7 days</li>
        </ul>
        <p><a class="btn btn-primary" data-checkout="paidMonthly" href="${CHECKOUT}">Continue to Paid Monthly</a></p>
        <p class="fine" data-checkout-note="paidMonthly">Continue to Paid Monthly opens https://app.edgedashpro.com/pricing. Straight to Stripe Checkout. There is no free trial of the subscription.</p>
      </article>
      <article class="card">
        <p class="tier-note">Paid annual</p>
        <h2>Per account</h2>
        <p class="price">$259 <span>/ year</span></p>
        <p>Straight to Stripe Checkout. No free trial. Paid Annual is $259/year.</p>
        <ul class="plan-list">
          <li>The same paid unlocks as monthly</li>
          <li>Scoped per user account</li>
          <li>25-user launch</li>
        </ul>
        <p><a class="btn btn-primary" data-checkout="paidAnnual" href="${CHECKOUT}">Continue to Paid Annual</a></p>
        <p class="fine" data-checkout-note="paidAnnual">Continue to Paid Annual opens https://app.edgedashpro.com/pricing. Straight to Stripe Checkout. There is no free trial of the subscription.</p>
      </article>
    </div>
    <section class="section">
      <div class="band">
        <h2>Waitlist</h2>
        <p>The paid launch is capped at 25 users. Paid Monthly and Paid Annual open https://app.edgedashpro.com/pricing. If those 25 places are full, email hello@edgedashpro.com to join the waitlist. This site does not promise a response time. You are not charged by this marketing website.</p>
        <p><a class="btn btn-ghost" data-checkout="waitlist" href="${MAILTO}">Email the waitlist</a></p>
        <p class="fine" data-checkout-note="waitlist">This opens an email to hello@edgedashpro.com.</p>
        <p class="fine"><a href="../checkout-canceled/">Checkout canceled</a> · <a href="../thank-you/">Thank you</a></p>
      </div>
    </section>
    <p class="legal-note">Do not include account numbers, passwords, or API keys in the email. ${DISCLAIMER}</p>
  </div>`
});

pages.push({
  file: "faq/index.html",
  slug: "faq",
  crumb: "FAQ",
  title: "FAQ — EdgeDashPro",
  description:
    "Answers about EdgeDashPro: the free public tier, the paid tier, locked filters, data feeds, the journal, and the risk disclaimer.",
  extraGraph: [
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    }
  ],
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">FAQ</p>
      <h1>Questions</h1>
      <p class="lede" style="margin-left:0">${DISCLAIMER}</p>
    </header>
    ${faqHtml()}
  </div>`
});

pages.push({
  file: "support/index.html",
  slug: "support",
  crumb: "Support",
  title: "Support — EdgeDashPro",
  description:
    "Contact EdgeDashPro support at hello@edgedashpro.com. Do not send account numbers, passwords, or API keys.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Support</p>
      <h1>Support</h1>
    </header>
    <p>Email <a href="mailto:hello@edgedashpro.com">hello@edgedashpro.com</a>. This site does not promise a response time, and it does not offer phone support.</p>
    <h2>What to include</h2>
    <ul>
      <li>What you were trying to do.</li>
      <li>What you expected, and what happened instead.</li>
      <li>The page or the part of the desk, in your own words.</li>
    </ul>
    <h2>What to leave out</h2>
    <p>Do not send account numbers, passwords, API keys, or brokerage logins. We do not need them to answer a question about this website.</p>
    <p>The <a href="../faq/">FAQ</a> covers the disclaimer, the free and paid tiers, data feeds, and the journal. Pricing is on the <a href="../access/">pricing page</a>. The automated assistant on each page answers from this website only.</p>
    <p><a class="btn btn-primary" href="mailto:hello@edgedashpro.com?subject=EdgeDashPro%20support">Email support</a></p>
  </div>`
});

pages.push({
  file: "contact/index.html",
  slug: "contact",
  crumb: "Contact",
  title: "Contact — EdgeDashPro",
  description:
    "Contact EdgeDashPro at hello@edgedashpro.com for the paid tier, the waitlist, or a question. The form opens your email app.",
  extraGraph: [
    {
      "@type": "ContactPage",
      url: BASE + "/contact/",
      name: "Contact EdgeDashPro",
      description: "Email hello@edgedashpro.com."
    }
  ],
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Contact</p>
      <h1>Contact</h1>
      <p class="lede" style="margin-left:0">Write to <a href="mailto:hello@edgedashpro.com">hello@edgedashpro.com</a>. The form opens your email app. This website does not store the message.</p>
    </header>
    <form class="form" data-contact-form action="mailto:hello@edgedashpro.com" method="post" enctype="text/plain">
      <label>Name <input name="name" type="text" autocomplete="name" required></label>
      <label>Email <input name="email" type="email" autocomplete="email" required></label>
      <label>Topic
        <select name="topic">
          <option>Paid Monthly</option>
          <option>Paid Annual</option>
          <option>Free account for the Squawk trial</option>
          <option>Join the waitlist</option>
          <option>Support</option>
          <option>Something else</option>
        </select>
      </label>
      <label>Message <textarea name="message" required></textarea></label>
      <p class="fine">Do not include account numbers, passwords, or API keys. Free public tier is $0. Paid is $29.99/month or $259/year, with no free trial.</p>
      <button class="btn btn-primary" type="submit">Open email</button>
    </form>
  </div>`
});

pages.push({
  file: "privacy/index.html",
  slug: "privacy",
  crumb: "Privacy",
  title: "Privacy Policy (Draft) — EdgeDashPro",
  description:
    "Draft privacy notice for the EdgeDashPro marketing site. The free product tier is ad-supported. Contact is by email. The assistant stays in the browser.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Draft</p>
      <h1>Privacy</h1>
    </header>
    <p class="draft-banner"><strong>Draft.</strong> This is a working notice for the marketing site, not a final privacy policy. It will be replaced when paid checkout is open.</p>
    <p>EdgeDashPro can be reached at hello@edgedashpro.com. This page describes the marketing website, and it names how the product tiers differ.</p>
    <h2>What this site collects</h2>
    <p>You do not create an account on this marketing site. Market, News, JAMSEC, Dilution, Stock Card, and Research do not require a login. Browser-based Squawk does: a free account in the product unlocks it for the first 7 days, and after that Squawk requires a paid account. That account is part of the product, not a form on these pages. If you email us, we receive what you chose to send, including your address and the message. Do not send account numbers, passwords, or API keys.</p>
    <p>This marketing site does not run its own analytics product and does not sell personal information. The site is hosted on GitHub Pages. The host may keep ordinary request logs. This notice does not control the host's own logging.</p>
    <h2>Ads on the free tier</h2>
    <p>The free public pages are ad-supported. They do not require a login. Browser-based Squawk is separate: a free account unlocks it for the first 7 days, and after that Squawk requires the paid tier and is ad-free. This marketing site does not set its own advertising cookie. This draft does not name an ad network. The notice will name it when one is in use.</p>
    <h2>The automated assistant</h2>
    <p>The assistant runs in your browser. Your question is matched against text that shipped with this website. The page does not send that question to another service.</p>
    <h2>Checkout</h2>
    <p>Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing. Checkout there is handled by Stripe. There is no free trial of the subscription. This marketing site does not store a card number. The waitlist button opens an email to hello@edgedashpro.com instead.</p>
    <h2>Cookies</h2>
    <p>This marketing site does not set a tracking cookie for advertising. Your browser may store nothing from us. The host may use its own technical cookies.</p>
    <h2>Children</h2>
    <p>This site is not directed at children.</p>
    <h2>Changes</h2>
    <p>When this draft is replaced, the new notice will be posted on this page. Questions: <a href="mailto:hello@edgedashpro.com">hello@edgedashpro.com</a>.</p>
  </div>`
});

pages.push({
  file: "terms/index.html",
  slug: "terms",
  crumb: "Terms",
  title: "Terms of Use (Draft) — EdgeDashPro",
  description:
    "Draft terms for the EdgeDashPro marketing site. Not investment advice. Free tier $0. Paid is $29.99 a month or $259 a year, with no free trial.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Draft</p>
      <h1>Terms</h1>
    </header>
    <p class="draft-banner"><strong>Draft.</strong> These are working terms for the marketing site, not a final customer agreement. They will be updated when paid checkout is open.</p>
    <p>${DISCLAIMER}</p>
    <h2>The tiers</h2>
    <p>Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research are $0. They do not require a login. They are ad-supported and read-only. ${LOCK}</p>
    <p>Browser-based Squawk is not on those pages. Free users must create a free account to access the 7-day Squawk trial. After 7 days, Squawk requires Paid and is ad-free. That window is only for Squawk.</p>
    <p>Paid Monthly is $29.99/month. Paid Annual is $259/year. The paid launch holds 25 users. There is no free trial of the subscription. Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing, straight to Stripe Checkout. The waitlist button emails hello@edgedashpro.com. You are not charged by this marketing website. Paid unlocks the interactive filter controls, custom filtering, saved filter presets, the journal, and ad-free Squawk, each scoped to the user account.</p>
    <h2>The website</h2>
    <p>The pages describe EdgeDashPro. They are informational. A description of a feature is not a promise that a particular feed is connected on a particular day. Standard Terms, Privacy, and the risk disclosure apply to both tiers.</p>
    <h2>Your decisions</h2>
    <p>You are responsible for your own trading decisions. EdgeDashPro does not buy or sell for you. It is not a brokerage.</p>
    <h2>No warranty</h2>
    <p>The marketing site is provided as available. We do not warrant that it will be uninterrupted or free of errors. To the extent the law allows, we are not liable for decisions you make after reading it.</p>
    <h2>Your messages</h2>
    <p>Do not send account numbers, passwords, or API keys. We may keep an email you send so we can reply.</p>
    <h2>The mark and the text</h2>
    <p>The EdgeDashPro name, the eDP monogram, and the text of this website belong to their owner. You may link to a page. You may not copy the site and present it as your own.</p>
    <h2>Contact</h2>
    <p>Questions about these draft terms: <a href="mailto:hello@edgedashpro.com">hello@edgedashpro.com</a>.</p>
  </div>`
});

pages.push({
  file: "thank-you/index.html",
  slug: "thank-you",
  crumb: "Thank you",
  robots: "noindex, nofollow",
  title: "Thank you — EdgeDashPro",
  description: "Return page for EdgeDashPro checkout. Paid has no free trial. Noindex.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <h1>Thank you</h1>
    </header>
    <p>If you reached this page from https://app.edgedashpro.com/pricing, thank you. Paid Monthly is $29.99/month and Paid Annual is $259/year. There is no free trial of the subscription. The waitlist email is hello@edgedashpro.com. You are not charged by this marketing website.</p>
    <p>This page is not indexed. The plan details are on <a href="../access/">Pricing and access</a>.</p>
  </div>`
});

pages.push({
  file: "checkout-canceled/index.html",
  slug: "checkout-canceled",
  crumb: "Checkout canceled",
  robots: "noindex, nofollow",
  title: "Checkout canceled — EdgeDashPro",
  description: "Checkout was canceled. You have not been charged by this EdgeDashPro website. No free trial was started. Noindex.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <h1>Checkout canceled</h1>
    </header>
    <p>Checkout was canceled. You have not been charged by this website. No free trial was started.</p>
    <p>You can return to <a href="../access/">pricing and access</a> or email the waitlist. This page is not indexed.</p>
  </div>`
});

pages.push({
  file: "sitemap/index.html",
  slug: "sitemap",
  crumb: "Site map",
  title: "Site map — EdgeDashPro",
  description: "Every public page on the EdgeDashPro marketing site, including draft legal pages and unindexed checkout pages.",
  body: `<div class="wrap">
    <header class="page-hero">
      <h1>Site map</h1>
      <p class="lede" style="margin-left:0">A list of the pages on this website. The XML sitemap used by crawlers omits the two unindexed checkout pages.</p>
    </header>
    <ul class="site-map-list">
      <li><a href="../">Home</a> — the two launch tiers.</li>
      <li><a href="../features/">Features</a> — free public pages, the filter lock, and paid unlocks.</li>
      <li><a href="../market/">Market</a> — the free read-only market view.</li>
      <li><a href="../journal/">Journal</a> — paid, per account.</li>
      <li><a href="../research/">Research</a> — Dilution, Stock Card, and Research.</li>
      <li><a href="../access/">Pricing</a> — $0, $29.99/month, or $259/year. No free trial.</li>
      <li><a href="../faq/">FAQ</a> — including the risk disclaimer.</li>
      <li><a href="../support/">Support</a> — email help.</li>
      <li><a href="../contact/">Contact</a> — a form that opens email.</li>
      <li><a href="../privacy/">Privacy (draft)</a></li>
      <li><a href="../terms/">Terms (draft)</a></li>
      <li><a href="../thank-you/">Thank you</a> — not indexed.</li>
      <li><a href="../checkout-canceled/">Checkout canceled</a> — not indexed.</li>
    </ul>
  </div>`
});

pages.push({
  file: "404.html",
  slug: "",
  crumb: "Not found",
  robots: "noindex, nofollow",
  title: "Page not found — EdgeDashPro",
  description: "That page is not on the EdgeDashPro website. Use the site map to find a page.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <h1>Page not found</h1>
    </header>
    <p>That address is not a page on this site. Try the <a href="./">home page</a> or the <a href="sitemap/">site map</a>.</p>
  </div>`
});

for (const page of pages) {
  const target = join(ROOT, page.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, layout(page));
}

const indexed = pages.filter((page) => page.file !== "404.html" && !String(page.robots || "").includes("noindex"));
const urls = indexed
  .map((page) => `  <url><loc>${canonical(page.slug, page.file)}</loc></url>`)
  .join("\n");
writeFileSync(
  join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

writeFileSync(
  join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nDisallow: /thank-you/\nDisallow: /checkout-canceled/\n\nSitemap: ${BASE}/sitemap.xml\n`
);

writeFileSync(join(ROOT, ".nojekyll"), "");
writeFileSync(join(ROOT, "CNAME"), "edgedashpro.com\n");

writeFileSync(
  join(ROOT, "site.webmanifest"),
  JSON.stringify(
    {
      name: "EdgeDashPro",
      short_name: "EdgeDashPro",
      id: "https://edgedashpro.com/",
      start_url: "https://edgedashpro.com/",
      display: "browser",
      background_color: "#07142e",
      theme_color: "#07142e",
      icons: [
        {
          src: "assets/img/favicon.svg",
          type: "image/svg+xml",
          sizes: "any",
          purpose: "any"
        }
      ]
    },
    null,
    2
  ) + "\n"
);

for (const dir of ["practice", "charts", "rules"]) {
  rmSync(join(ROOT, dir), { recursive: true, force: true });
}

console.log(`Wrote ${pages.length} HTML pages, sitemap.xml, robots.txt, .nojekyll`);
