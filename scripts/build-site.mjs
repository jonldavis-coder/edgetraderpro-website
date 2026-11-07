import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://jonldavis-coder.github.io/edgetraderpro-website";
const DISCLAIMER =
  "Edge Trader Pro is not investment advice. Trading involves risk of loss. Past results do not guarantee future results.";

const NAV = [
  ["features", "Features"],
  ["charts", "Charts & Screeners"],
  ["practice", "Practice"],
  ["journal", "Journal"],
  ["rules", "Rules & Risk"],
  ["faq", "FAQ"]
];

const FOOTER = [
  ["", "Home"],
  ["features", "Features"],
  ["charts", "Charts & Screeners"],
  ["practice", "Practice"],
  ["journal", "Journal"],
  ["rules", "Rules & Risk"],
  ["access", "Access"],
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
    q: "What is Edge Trader Pro?",
    a: "Edge Trader Pro is a web desk for people who trade their own plan. The tagline is Your rules. Your data. Your desk. The current desk covers linked charts and workspaces, multi-pane screeners, the paper practice simulator, a trade journal, news and alerts, and rule and risk controls with research cards."
  },
  {
    q: "Is Edge Trader Pro investment advice?",
    a: DISCLAIMER + " Nothing on this website is a recommendation to buy or sell. The desk is a process tool. It does not publish customer results."
  },
  {
    q: "Are the data feeds real-time and always connected?",
    a: "No. This site does not describe the data as universally connected or real-time. A field with no feed stays n/a. A delayed quote can wear a delayed tag. A panel without a connected feed stays grey."
  },
  {
    q: "What can I do with charts and screeners?",
    a: "Charts show candles, VWAP, volume, and MACD, with drawing tools and color links to screeners, news, and details. Workspaces save that layout. Screeners run in up to four panes, with built-in presets you can clone, filters, and watchlists you can import."
  },
  {
    q: "What is ProTrader MOSAIC?",
    a: "ProTrader MOSAIC is the practice simulator. It is paper-only. You can replay a session and see paper fills on the chart. A paper fill is not a live order."
  },
  {
    q: "What does the journal include today?",
    a: "Today the journal has editable rows and a reviews page for post-trade reviews. Broker execution import, automatic journal capture, chart marks for entry and exit, reports, a calendar, sharing and mentoring, and MAE/MFE analytics are on the roadmap. They are not in the current desk."
  },
  {
    q: "Will the desk place trades for me?",
    a: "No. You use the desk yourself. The practice simulator does not send a live order. This website does not offer a service that buys or sells for you."
  },
  {
    q: "How do I get access, and what does it cost?",
    a: "Pricing is not set. Request access or join the waitlist by emailing hello@edgetraderpro.com. Payment links are empty, so the buttons on the access page open that email."
  },
  {
    q: "Can you set the desk up for me?",
    a: "Custom setup services are available. Contact us at hello@edgetraderpro.com. No price is listed for setup."
  },
  {
    q: "How do I reach support?",
    a: "Email hello@edgetraderpro.com. Say what you were doing and what you expected. Do not send account numbers, passwords, or API keys. This site does not promise a response time."
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
        name: "Edge Trader Pro",
        description: page.description,
        publisher: { "@id": BASE + "/#org" },
        inLanguage: "en"
      },
      {
        "@type": "Organization",
        "@id": BASE + "/#org",
        name: "Edge Trader Pro",
        url: BASE + "/",
        email: "hello@edgetraderpro.com",
        slogan: "Your rules. Your data. Your desk.",
        logo: BASE + "/assets/img/logo.svg"
      },
      {
        "@type": "SoftwareApplication",
        name: "Edge Trader Pro",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: BASE + "/",
        description:
          "A trading desk for linked charts, screeners, a paper practice simulator, a trade journal, news and alerts, and risk rules. Pricing is not set."
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
  <meta property="og:site_name" content="Edge Trader Pro">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE}/assets/img/og.png">
  <meta property="og:image:alt" content="Edge Trader Pro mark on navy, with the tagline Your rules. Your data. Your desk.">
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
        <img src="${pre}assets/img/mark.svg" alt="" width="48" height="92">
        <span class="brand-name">Edge Trader Pro</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary">
        ${nav}
        <a class="btn btn-primary header-cta" href="${href(page.file, "access")}">Request access</a>
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
        <p class="fine" style="margin:0">Edge Trader Pro · Your rules. Your data. Your desk.</p>
        <ul class="footer-links">${footer}</ul>
      </div>
      <p class="legal-note">Pricing is not set. Feature notes follow the product release log through 2 November 2026. Screens behind sign-in were not re-checked for this website. © 2026 Edge Trader Pro.</p>
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
        <button type="button" data-suggest="What is on the desk today?">What is on the desk today?</button>
        <button type="button" data-suggest="Is this investment advice?">Is this investment advice?</button>
        <button type="button" data-suggest="What does the journal include?">Journal</button>
        <button type="button" data-suggest="How do I request access?">Access</button>
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
  title: "Edge Trader Pro — Your rules. Your data. Your desk.",
  description:
    "Edge Trader Pro is a trading desk for linked charts, multi-pane screeners, a paper practice simulator, an editable journal, news and alerts, and risk rules. Pricing is not set.",
  body: `<div class="wrap">
    <section class="hero">
      <img class="hero-logo" src="assets/img/logo.svg" alt="Edge Trader Pro mark: an italic e over a bar, a capital T with a small pro, and rising candlesticks.">
      <h1>Edge Trader Pro</h1>
      <p class="tagline">Your rules. Your data. Your desk.</p>
      <p class="lede">A web desk for people who trade their own plan. Link charts to screeners, rehearse on a paper simulator, keep a journal you can edit, and leave your risk rules in view.</p>
      <div class="cta-row">
        <a class="btn btn-primary" data-checkout="waitlist" href="mailto:hello@edgetraderpro.com?subject=Edge%20Trader%20Pro%20%E2%80%94%20request%20access">Request access / Join the waitlist</a>
        <a class="btn btn-ghost" href="features/">See what is on the desk</a>
      </div>
      <p class="fine" data-checkout-note="waitlist">Pricing is not set. This opens an email to hello@edgetraderpro.com.</p>
      <p class="mark-note">The candlesticks in the mark are the brand, not a chart of results. This site does not publish performance.</p>
    </section>
    <section class="section" aria-labelledby="today-heading">
      <p class="kicker">Current</p>
      <h2 id="today-heading">On the desk today</h2>
      <p class="section-intro">These are the areas documented for the product. A field with no feed stays n/a.</p>
      <div class="card-grid">
        <article class="card">
          <h3><a href="charts/">Linked charts and workspaces</a></h3>
          <p>Candles, VWAP, volume, and MACD, with drawing tools. Color links tie a chart to screeners, news, and details. Save the layout as a workspace.</p>
        </article>
        <article class="card">
          <h3><a href="charts/">Screeners, presets, and watchlists</a></h3>
          <p>One to four scanner panes, built-in presets you can clone, filters, and symbol lists you can import and keep.</p>
        </article>
        <article class="card">
          <h3><a href="practice/">ProTrader MOSAIC</a></h3>
          <p>The practice simulator. Paper-only, with session replay. A paper fill is not a live order.</p>
        </article>
        <article class="card">
          <h3><a href="journal/">Journal and reviews</a></h3>
          <p>A trade journal with editable rows, and a reviews page for post-trade reviews.</p>
        </article>
        <article class="card">
          <h3><a href="features/#news">News, alerts, and context</a></h3>
          <p>An in-app reader, configurable alerts, squawk, and market and sector context. Context pills are not signals.</p>
        </article>
        <article class="card">
          <h3><a href="rules/">Rules, research, and dilution</a></h3>
          <p>Risk rules you can see, plus a stock card and a dilution scorecard with PDF download.</p>
        </article>
      </div>
    </section>
    <section class="section">
      <div class="band">
        <h2>How the desk treats missing data</h2>
        <p>This site does not describe the data as universally connected or real-time. A tab or field with no feed stays n/a. Market tiles can show a delayed tag. Optional panels stay grey until a feed is connected, and a feed that is failing stays marked that way.</p>
      </div>
    </section>
    <section class="section" aria-labelledby="shots-heading">
      <h2 id="shots-heading">App images</h2>
      <p class="section-intro">Screenshots of the desk are not on this site yet. The frames below are reserved and captioned.</p>
      <div class="shot-grid">
        ${shot("Linked chart workspace", "Placeholder for a later image of a chart with candles, VWAP, volume, and MACD.")}
        ${shot("Multi-pane screener", "Placeholder for a later image of saved scanner panes, presets, and filters.")}
        ${shot("Trade journal", "Placeholder for a later image of editable journal rows and a post-trade review.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "features/index.html",
  slug: "features",
  crumb: "Features",
  title: "Features — Edge Trader Pro",
  description:
    "Current Edge Trader Pro features: linked charts, multi-pane screeners, ProTrader MOSAIC practice, an editable journal, news and squawk, and risk rules with research cards.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Current desk</p>
      <h1>Features</h1>
      <p class="lede" style="margin-left:0">The areas below are the current desk, taken from the product release log through 2 November 2026. The public sign-in page showed this mark on 7 November 2026. Screens behind sign-in were not re-checked for this page. Nothing here is a performance claim.</p>
    </header>
    <article class="prose">
      <h2>Linked charts and workspaces</h2>
      <p>Open a chart on the dark quote layout: company and last price, candles, VWAP, volume, and MACD. Drawing tools draw on the chart. A color link ties that chart to scanner panes, news, and the details window sharing the color.</p>
      <p>A workspace saves the chart layout, the scanner panes, link colors, signal and news colors, and squawk switches. You can save, save as, rename, duplicate, delete, set a default, and export or import the workspace as JSON. On an iPad the chart grid draws tighter and leaves the saved layout as it is.</p>
      <p><a href="../charts/">Charts and screeners in more detail</a></p>
      <h2>Saved multi-pane screeners</h2>
      <p>Run one, two, three, or four scanner panes. Two sit side by side, three are columns, and four is a two-by-two grid. On iPad, two and three stack, and four stays a grid. Each pane keeps its own preset, filters, tab, sort, and cooldown.</p>
      <p>Thirty-eight built-in screen presets ship in named groups, including low float, premarket and postmarket, and fundamental screens. Clone and edit a preset. Saving a copy does not replace a built-in screen or a scanner you already saved. Scanners save on the signed-in account. The first visit can copy scanners that lived only in that browser, without replacing a copy already saved.</p>
      <p>When the data is present, presets can use price, change, gap, market cap, float, relative volume, volume, price times volume, average volume, ADR, premarket and postmarket change and volume, one-week, one-month, and one-year performance, and SMA, EMA, ADX, and Stochastic when daily bars are long enough, plus common stock and exchange. P/E, PEG, dividends, IPO date, depositary receipt, and technical rating stay on the preset as n/a when there is no feed. Desk risk rules do not block a scan.</p>
      <h2>Watchlists</h2>
      <p>Import a symbol list. A TradingView export is accepted. US equity prefixes are stripped, and section headers, indices, futures, forex, and crypto are dropped. Replace the main list or merge into it. Dated lists stay selectable. A name outside the price or float band can remain on the list and show an out-of-band tag when a quote or float is already cached.</p>
      <h2>ProTrader MOSAIC, the practice simulator</h2>
      <p>The practice simulator is paper-only and includes replay. Read the <a href="../practice/">practice page</a> for what that screen does, and what it does not do.</p>
      <h2>Journal and reviews</h2>
      <p>The journal has rows you can edit. A separate reviews page holds post-trade reviews. Further journal tools are labeled on the roadmap and are not in the product today. See the <a href="../journal/">journal page</a>.</p>
      <h2 id="news">News, alerts, squawk, and market context</h2>
      <p>News rows include a second pane with its own filters. A headline opens an in-app reader with the feed summary, a Why It's Moving note, and a link to the original. Squawk reads chosen headlines and market alerts aloud: an on/off switch, a volume slider, a test, and settings for voice, rate, and which items are read. A close back under VWAP can be spoken as Lost VWAP, and a close back above it as Reclaimed VWAP. VWAP squawk starts off until you change it.</p>
      <p>Alerts has an inbox, a dilution feed, and rules. You can filter alert rows and create a rule. A signal is an alert row, not a trade. Halt up, halt down, and halt/resume are separate types. Each signal type and each news source can take a color, shown as a light tint and a solid bar.</p>
      <p>Market overview stacks index cards, market-moving headlines, a theme heat map, a sector ETF heat map, and industry tiles for pharma, biotech, semiconductors, regional banks, oil and gas, and gold miners. A bull and bear ETF tape sits with them. A tile can show Favors shorts, Favors longs, or Neutral. That pill is context, not a signal. A change under half a percent reads Neutral. Bear funds flip the read, because a rise in the bear fund means the sector is falling. A tile can show a delayed tag when the quote is delayed.</p>
      <h2>Rules, research cards, and dilution</h2>
      <p>Risk rules are visible on the desk, including the price band, float, share cap, name cap, daily loss limit, a stop on every trade, no short without a borrow, regular hours, and a named setup. Research cards cover a stock card and a dilution scorecard. Details are on the <a href="../rules/">rules and risk page</a>.</p>
      <h2>Also on the desk</h2>
      <ul>
        <li>Sign-in carries the e/T pro mark. A long idle period signs you out.</li>
        <li>An admin can switch the desk to a demo tape. Demo adds a banner, and the desk asks before the switch.</li>
        <li>Mission Control opens a desk overview: session gauges, a pre-flight list, and tiles to the rest of the desk. A status board reports component health. A feed that is not configured stays grey. Status can use a three-screen console view. The choice is remembered in this browser.</li>
        <li>An earnings view can filter on market cap. Names with no market cap drop out while that filter is on.</li>
        <li>Level 2 and time and sales are on the desk. Borrow and locate, the flow panel, a short-interest cell, and some social mentions stay grey until that feed is connected.</li>
        <li>kCURVE, a signed-in training library, holds a curated reading list and the playbook. Those files open only after sign-in.</li>
      </ul>
      <div class="callout">
        <p>This site does not describe the data as universally connected or real-time. Where a feed is missing, the desk shows n/a or stays grey.</p>
      </div>
    </article>
    <section class="section" aria-labelledby="feature-shots">
      <h2 id="feature-shots">Screenshot slots</h2>
      <div class="shot-grid">
        ${shot("Desk overview", "Placeholder for a later image of Mission Control, the pre-flight list, and the tile grid.")}
        ${shot("Charts and details", "Placeholder for a later image of the dark quote layout with candles, VWAP, volume, and MACD.")}
        ${shot("Multi-pane screeners", "Placeholder for a later image of one to four scanner panes with presets and color links.")}
        ${shot("Market overview", "Placeholder for a later image of sector and industry context. Not a performance chart.")}
        ${shot("News and squawk", "Placeholder for a later image of the news reader and squawk controls.")}
        ${shot("Dilution scorecard and stock card", "Placeholder for a later image of the research cards. Figures in a future image are sample data.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "charts/index.html",
  slug: "charts",
  crumb: "Charts & Screeners",
  title: "Charts & Screeners — Edge Trader Pro",
  description:
    "Linked Edge Trader Pro charts with candles, VWAP, volume, and MACD, saved workspaces, multi-pane screeners, presets, filters, and watchlists.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Current</p>
      <h1>Charts &amp; Screeners</h1>
      <p class="lede" style="margin-left:0">Charts, screeners, and watchlists stay linked by color, and the layout can be saved with the account.</p>
    </header>
    <article class="prose">
      <h2>The chart</h2>
      <p>The desk chart and the details window use the dark quote layout: company and last price, a tab row, drawing tools, and candles with VWAP, volume, and MACD. A popped-out chart uses the same layout. A tab or field with no feed stays n/a. Demo chart bars are a real intraday series for that sample, and the details close uses the same prior close as the headline.</p>
      <p>A color dot on a scanner pane links that pane to charts, news, and details of the same color. A ticker in a headline, written as a symbol or an exchange prefix, can open details.</p>
      <h2>Workspaces</h2>
      <p>Workspace, in the top bar, saves the chart layout, scanner panes, link colors, signal and news colors, and squawk switches. The actions are save, save as, rename, duplicate, delete, set default, and a JSON export and import. Create, rename, duplicate, and delete ask first and change only your copies.</p>
      <h2>Multi-pane screeners</h2>
      <p>Pick one, two, three, or four panes. Two sit side by side, three are columns, four is a two-by-two grid. iPad stacks two and three and keeps four as a grid. Each pane has its own preset, including filters, tab, sort, and cooldown, and panes on the same tab share one poll.</p>
      <p>Thirty-eight built-in screens are scanner presets. They keep their names, filters, and sort, in groups that include low float, premarket and postmarket, and fundamental screens. You can clone and edit a preset. A saved copy does not replace a built-in screen.</p>
      <h3>Filters, and fields that stay n/a</h3>
      <p>Presets apply price, change, gap, market cap, float, relative volume, volume, price times volume, average volume, ADR, premarket and postmarket change and volume, and one-week, one-month, and one-year performance. SMA, EMA, ADX, and Stochastic apply when daily bars are long enough. Common stock and exchange apply too. P/E, PEG, dividends, IPO date, depositary receipt, and technical rating remain n/a. There is no feed for those fields.</p>
      <p>Market-cap filters accept spellings such as 300, 300M, or 0.3B for 300 million dollars, and hide names above that cap. Float accepts a spelling such as 20M. Signal filters are checkboxes, one per concept, remembered in the browser until you change them.</p>
      <h2>Watchlists</h2>
      <p>Import a symbol list, including a list exported from TradingView. You can replace the main list or merge symbols into it. Each imported name can be kept as its own dated list, and older dated lists stay selectable. Names outside the $1 to $20 band, or with float of at least 20 million shares, can stay on the list and show an out-of-band tag when a quote or float is already on hand.</p>
      <p>The same saved scanner list is available on each scanner pane, on charts, on signals, on squawk, and on the news scan menu.</p>
    </article>
    <section class="section">
      <div class="shot-grid">
        ${shot("Chart with candles, VWAP, volume, and MACD", "Placeholder for a later chart image. The candlesticks in the site logo are not this screenshot.")}
        ${shot("Four scanner panes", "Placeholder for a later image of a multi-pane screener with separate presets.")}
        ${shot("Workspace and watchlist", "Placeholder for a later image of a saved workspace and an imported symbol list.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "practice/index.html",
  slug: "practice",
  crumb: "Practice",
  title: "ProTrader MOSAIC Practice Simulator — Edge Trader Pro",
  description:
    "ProTrader MOSAIC is the Edge Trader Pro practice simulator. It is paper-only, with session replay, paper fills, and order lines. It does not send a live order.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Current · paper only</p>
      <h1>ProTrader MOSAIC (practice simulator)</h1>
      <p class="lede" style="margin-left:0">A place to rehearse a session. Replay is part of the simulator. Nothing on this screen is a live order.</p>
    </header>
    <article class="prose">
      <div class="callout">
        <p>ProTrader MOSAIC is paper-only. A paper fill drawn on the chart is practice. It is not an order sent to a broker, and it is not a record of profit or loss.</p>
      </div>
      <h2>What you can practice</h2>
      <p>The simulator opens as its own part of the desk and can pop out to a window. The chart can show candles, volume, VWAP, and an EMA, plus estimated limit-up and limit-down bands, paper fills, and order lines. You can switch chart styles. That choice is saved in this browser. Saving the layout writes the windows.</p>
      <p>Replay plays a session back so you can review price action away from the moment it printed. Replay depends on the session that is available. This page does not claim that every symbol, every day, or a live tape is connected.</p>
      <h2>What it is not</h2>
      <ul>
        <li>It does not send a live order.</li>
        <li>It is not a brokerage account and this website shows no account number.</li>
        <li>It is not a promise about future trades. ${DISCLAIMER}</li>
      </ul>
      <p>The name on this page is the practice simulator. Older notes called the same paper screen the desk sim. The behavior described here is the paper simulator with replay, not a second product.</p>
    </article>
    <section class="section">
      ${shot("ProTrader MOSAIC practice simulator", "Placeholder for a later image of the paper simulator, replay, and paper fills. Not a live capture, and not a results chart.")}
    </section>
  </div>`
});

pages.push({
  file: "journal/index.html",
  slug: "journal",
  crumb: "Journal",
  title: "Trade Journal — Edge Trader Pro",
  description:
    "The Edge Trader Pro journal today: editable trade rows and post-trade reviews. Broker import, calendar, sharing, and excursion stats are on the roadmap, not in the product.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Current</p>
      <h1>Journal</h1>
      <p class="lede" style="margin-left:0">A journal of the trades you record, with rows you can edit and a place to write the review after the trade.</p>
    </header>
    <article class="prose">
      <h2>What is in the journal today</h2>
      <ul>
        <li>A trade journal on the desk.</li>
        <li>Rows with an edit action, so a note can be corrected after you enter it.</li>
        <li>A reviews page for a post-trade review: what you planned, what you did, and what you would repeat.</li>
      </ul>
      <p>The journal stores the row you write. This website does not turn those rows into a profit figure, a win rate, or a public track record.</p>
    </article>
    <section class="roadmap" aria-labelledby="roadmap-heading">
      <p class="kicker kicker-road">On the roadmap</p>
      <h2 id="roadmap-heading">Not in the current desk</h2>
      <p>These journal additions are listed so the direction is clear. They are not available. They are not part of the product described above.</p>
      <ul>
        <li><strong>Broker execution import.</strong> Bring fills in from a broker instead of typing each one. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>Automatic journal capture.</strong> The journal records the trade as you complete it, so the row is not typed by hand. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>Entry and exit marked on charts.</strong> The prices you entered and exited, drawn on the price chart. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>Reports by setup, tag, time, and price.</strong> Group the journal and read it back by how you traded. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>A journal calendar.</strong> See which days have journal rows, on a month view. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>Sharing and mentoring.</strong> Let a mentor read a journal you choose to share. <span class="not-yet">Not in the current desk.</span></li>
        <li><strong>MAE/MFE and exit-efficiency analytics.</strong> How far price moved against the trade and for the trade, and how much of that favorable move the exit kept. <span class="not-yet">Not in the current desk.</span></li>
      </ul>
    </section>
    <section class="section">
      <div class="shot-grid">
        ${shot("Journal rows", "Placeholder for a later image of the journal with an editable row. Not a results report.")}
        ${shot("Post-trade review", "Placeholder for a later image of a written review after a trade.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "rules/index.html",
  slug: "rules",
  crumb: "Rules & Risk",
  title: "Rules & Risk — Edge Trader Pro",
  description:
    "Risk rules shown on the Edge Trader Pro desk, plus stock cards and dilution analysis. Not investment advice. Trading involves risk of loss.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Current</p>
      <h1>Rules &amp; Risk</h1>
      <p class="lede" style="margin-left:0">The desk shows the rules around a trade. A rule on a screen does not remove market risk.</p>
    </header>
    <div class="split">
      <article class="prose">
        <h2>Rules the desk shows</h2>
        <p>These limits are part of the desk. They apply to trading from the desk. They do not block a scan. They are not a forecast.</p>
        <ul class="rule-list">
          <li><strong>$1 to $20.</strong> The working price band for names the desk treats as in range.</li>
          <li><strong>Float under 20 million shares.</strong> Names at or above that float can still sit on a watchlist with an out-of-band tag.</li>
          <li><strong>A share cap.</strong> Size is capped on the order.</li>
          <li><strong>A cap on open names.</strong> The desk limits how many names are open at once, with a tighter cap on a Federal Reserve announcement day.</li>
          <li><strong>A daily loss limit.</strong> The day has a loss figure you can see. It is a limit, not a result.</li>
          <li><strong>A stop on every trade.</strong> The rule calls for a stop with the order.</li>
          <li><strong>No borrow, no short.</strong> A short needs a borrow.</li>
          <li><strong>Regular trading hours only.</strong> Extended-hours orders are outside the rule.</li>
          <li><strong>A named setup.</strong> The trade is tied to a setup you can name.</li>
        </ul>
        <p>Levered products on the bull and bear tape are marked so they stay out of a trade. The tape itself is context, not a signal.</p>
        <div class="callout"><p>${DISCLAIMER}</p></div>
      </article>
      <aside class="panel card">
        <h2>Research cards and dilution</h2>
        <p>A stock card and a dilution scorecard reopen the last symbol for the account unless the address bar names one. Dilution shows a risk bar and a score from 0 to 100, with offering math. Download a PDF of either card.</p>
        <p>A research write-up can hold a short case, a squeeze case, and a plan. This site does not publish the outcome of any study.</p>
        <p>Short interest, borrow and locate, and some other research cells stay grey until a feed is connected. A connected feed that is failing stays marked as failing. Level 2 and time and sales are separate from those grey cells.</p>
      </aside>
    </div>
    <section class="section">
      <div class="shot-grid">
        ${shot("Risk rules", "Placeholder for a later image of the risk rules on the desk. Sample figures only, when an image is added.")}
        ${shot("Dilution scorecard", "Placeholder for a later image of the dilution risk bar, score, and stock card.")}
      </div>
    </section>
  </div>`
});

pages.push({
  file: "access/index.html",
  slug: "access",
  crumb: "Access",
  title: "Request Access — Edge Trader Pro",
  description:
    "Pricing for Edge Trader Pro is not set. Request access or join the waitlist by email. Custom setup services are available. Contact us. No price is listed.",
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Access</p>
      <h1>Request access / Join the waitlist</h1>
      <p class="lede" style="margin-left:0">Pricing is not set. There is no public price, and the payment links on this site are empty. The buttons below open an email to hello@edgetraderpro.com.</p>
    </header>
    <div class="card-grid">
      <article class="card">
        <h2>The desk</h2>
        <p>Ask for access or join the waitlist. Tell us how you want to use the desk. We reply by email.</p>
        <p><a class="btn btn-primary" data-checkout="access" href="mailto:hello@edgetraderpro.com?subject=Edge%20Trader%20Pro%20%E2%80%94%20request%20access">Request access / Join the waitlist</a></p>
        <p class="fine" data-checkout-note="access">Pricing is not set. This opens an email to hello@edgetraderpro.com.</p>
      </article>
      <article class="card">
        <h2>Custom setup</h2>
        <p>Custom setup services are available. Contact us. No price is listed for setup. Describe the workflow you want and we will reply.</p>
        <p><a class="btn btn-ghost" data-checkout="customSetup" href="mailto:hello@edgetraderpro.com?subject=Edge%20Trader%20Pro%20%E2%80%94%20custom%20setup">Contact us about setup</a></p>
        <p class="fine" data-checkout-note="customSetup">No price is listed. This opens an email.</p>
      </article>
      <article class="card">
        <h2>Checkout</h2>
        <p>Online checkout is not open. If a Stripe Payment Link is added later, the access button will open it. Until that slot has a link, it falls back to email. You are not charged by this website.</p>
        <p><a href="../checkout-canceled/">Checkout canceled</a> · <a href="../thank-you/">Thank you</a></p>
      </article>
    </div>
    <p class="legal-note">Do not include account numbers, passwords, or API keys in the email.</p>
  </div>`
});

pages.push({
  file: "faq/index.html",
  slug: "faq",
  crumb: "FAQ",
  title: "FAQ — Edge Trader Pro",
  description:
    "Answers about Edge Trader Pro: what the desk includes, data feeds, the practice simulator, the journal, access, and the risk disclaimer.",
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
  title: "Support — Edge Trader Pro",
  description:
    "Contact Edge Trader Pro support at hello@edgetraderpro.com. Do not send account numbers, passwords, or API keys.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Support</p>
      <h1>Support</h1>
    </header>
    <p>Email <a href="mailto:hello@edgetraderpro.com">hello@edgetraderpro.com</a>. This site does not promise a response time, and it does not offer phone support.</p>
    <h2>What to include</h2>
    <ul>
      <li>What you were trying to do.</li>
      <li>What you expected, and what happened instead.</li>
      <li>The page or the part of the desk, in your own words.</li>
    </ul>
    <h2>What to leave out</h2>
    <p>Do not send account numbers, passwords, API keys, or brokerage logins. We do not need them to answer a question about this website.</p>
    <p>The <a href="../faq/">FAQ</a> covers the disclaimer, data feeds, the journal, and access. The automated assistant on each page answers from this website only.</p>
    <p><a class="btn btn-primary" href="mailto:hello@edgetraderpro.com?subject=Edge%20Trader%20Pro%20support">Email support</a></p>
  </div>`
});

pages.push({
  file: "contact/index.html",
  slug: "contact",
  crumb: "Contact",
  title: "Contact — Edge Trader Pro",
  description:
    "Contact Edge Trader Pro at hello@edgetraderpro.com for access, custom setup, or a question. The form opens your email app.",
  extraGraph: [
    {
      "@type": "ContactPage",
      url: BASE + "/contact/",
      name: "Contact Edge Trader Pro",
      description: "Email hello@edgetraderpro.com."
    }
  ],
  body: `<div class="wrap">
    <header class="page-hero">
      <p class="kicker">Contact</p>
      <h1>Contact</h1>
      <p class="lede" style="margin-left:0">Write to <a href="mailto:hello@edgetraderpro.com">hello@edgetraderpro.com</a>. The form opens your email app. This website does not store the message.</p>
    </header>
    <form class="form" data-contact-form action="mailto:hello@edgetraderpro.com" method="post" enctype="text/plain">
      <label>Name <input name="name" type="text" autocomplete="name" required></label>
      <label>Email <input name="email" type="email" autocomplete="email" required></label>
      <label>Topic
        <select name="topic">
          <option>Request access</option>
          <option>Join the waitlist</option>
          <option>Custom setup</option>
          <option>Support</option>
          <option>Something else</option>
        </select>
      </label>
      <label>Message <textarea name="message" required></textarea></label>
      <p class="fine">Do not include account numbers, passwords, or API keys. Pricing is not set. Custom setup services are available, and no price is listed.</p>
      <button class="btn btn-primary" type="submit">Open email</button>
    </form>
  </div>`
});

pages.push({
  file: "privacy/index.html",
  slug: "privacy",
  crumb: "Privacy",
  title: "Privacy Policy (Draft) — Edge Trader Pro",
  description:
    "Draft privacy notice for the Edge Trader Pro marketing site. Contact is by email. The assistant stays in the browser.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Draft</p>
      <h1>Privacy</h1>
    </header>
    <p class="draft-banner"><strong>Draft.</strong> This is a working notice for the marketing site, not a final privacy policy. It will be replaced when access opens.</p>
    <p>Edge Trader Pro can be reached at hello@edgetraderpro.com. This page describes the marketing website only.</p>
    <h2>What this site collects</h2>
    <p>You do not create an account on this marketing site. If you email us, we receive what you chose to send, including your address and the message. Do not send account numbers, passwords, or API keys.</p>
    <p>This site does not run its own analytics product and does not sell personal information. The site is hosted on GitHub Pages. The host may keep ordinary request logs. This notice does not control the host's own logging.</p>
    <h2>The automated assistant</h2>
    <p>The assistant runs in your browser. Your question is matched against text that shipped with this website. The page does not send that question to another service.</p>
    <h2>Cookies</h2>
    <p>This marketing site does not set a tracking cookie for advertising. Your browser may store nothing from us. The host may use its own technical cookies.</p>
    <h2>Children</h2>
    <p>This site is not directed at children.</p>
    <h2>Changes</h2>
    <p>When this draft is replaced, the new notice will be posted on this page. Questions: <a href="mailto:hello@edgetraderpro.com">hello@edgetraderpro.com</a>.</p>
  </div>`
});

pages.push({
  file: "terms/index.html",
  slug: "terms",
  crumb: "Terms",
  title: "Terms of Use (Draft) — Edge Trader Pro",
  description:
    "Draft terms for the Edge Trader Pro marketing site. Not investment advice. Pricing is not set. Trading involves risk of loss.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <p class="kicker">Draft</p>
      <h1>Terms</h1>
    </header>
    <p class="draft-banner"><strong>Draft.</strong> These are working terms for the marketing site, not a final customer agreement. They will be updated when access opens.</p>
    <p>${DISCLAIMER}</p>
    <h2>The website</h2>
    <p>The pages describe Edge Trader Pro. They are informational. Access to the desk is by request. Pricing is not set. Custom setup services are available only by contacting us, and no price is listed here.</p>
    <h2>Your decisions</h2>
    <p>You are responsible for your own trading decisions. The practice simulator is paper-only and is not a brokerage. A description of a feature is not a promise that a particular feed is connected on a particular day.</p>
    <h2>No warranty</h2>
    <p>The marketing site is provided as available. We do not warrant that it will be uninterrupted or free of errors. To the extent the law allows, we are not liable for decisions you make after reading it.</p>
    <h2>Your messages</h2>
    <p>Do not send account numbers, passwords, or API keys. We may keep an email you send so we can reply.</p>
    <h2>The mark and the text</h2>
    <p>The Edge Trader Pro name, the e/T pro mark, and the text of this website belong to their owner. You may link to a page. You may not copy the site and present it as your own.</p>
    <h2>Contact</h2>
    <p>Questions about these draft terms: <a href="mailto:hello@edgetraderpro.com">hello@edgetraderpro.com</a>.</p>
  </div>`
});

pages.push({
  file: "thank-you/index.html",
  slug: "thank-you",
  crumb: "Thank you",
  robots: "noindex, nofollow",
  title: "Thank you — Edge Trader Pro",
  description: "Return page for a future Edge Trader Pro checkout. Pricing is not set. Noindex.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <h1>Thank you</h1>
    </header>
    <p>If you reached this page from a future checkout, thank you. Pricing is not set, and the payment links on this site are empty, so most people will have emailed hello@edgetraderpro.com instead.</p>
    <p>This page is not indexed. If you meant to join the waitlist, use <a href="../access/">Request access</a>.</p>
  </div>`
});

pages.push({
  file: "checkout-canceled/index.html",
  slug: "checkout-canceled",
  crumb: "Checkout canceled",
  robots: "noindex, nofollow",
  title: "Checkout canceled — Edge Trader Pro",
  description: "Checkout was canceled. You have not been charged by this Edge Trader Pro website. Noindex.",
  body: `<div class="wrap prose">
    <header class="page-hero">
      <h1>Checkout canceled</h1>
    </header>
    <p>Checkout was canceled. You have not been charged by this website. Pricing is not set.</p>
    <p>You can <a href="../access/">request access or join the waitlist</a> by email. This page is not indexed.</p>
  </div>`
});

pages.push({
  file: "sitemap/index.html",
  slug: "sitemap",
  crumb: "Site map",
  title: "Site map — Edge Trader Pro",
  description: "Every public page on the Edge Trader Pro marketing site, including draft legal pages and unindexed checkout pages.",
  body: `<div class="wrap">
    <header class="page-hero">
      <h1>Site map</h1>
      <p class="lede" style="margin-left:0">A list of the pages on this website. The XML sitemap used by crawlers omits the two unindexed checkout pages.</p>
    </header>
    <ul class="site-map-list">
      <li><a href="../">Home</a> — the mark, the tagline, and the current desk.</li>
      <li><a href="../features/">Features</a> — what the release log supports, without performance claims.</li>
      <li><a href="../charts/">Charts &amp; Screeners</a> — linked charts, workspaces, presets, and watchlists.</li>
      <li><a href="../practice/">Practice</a> — ProTrader MOSAIC, the paper practice simulator.</li>
      <li><a href="../journal/">Journal</a> — editable rows and reviews, plus a labeled roadmap.</li>
      <li><a href="../rules/">Rules &amp; Risk</a> — risk rules, research cards, and dilution.</li>
      <li><a href="../access/">Access</a> — request access. Pricing is not set.</li>
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
  title: "Page not found — Edge Trader Pro",
  description: "That page is not on the Edge Trader Pro website. Use the site map to find a page.",
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
  `User-agent: *\nAllow: /\n\nDisallow: /edgetraderpro-website/thank-you/\nDisallow: /edgetraderpro-website/checkout-canceled/\n\nSitemap: ${BASE}/sitemap.xml\n`
);

writeFileSync(join(ROOT, ".nojekyll"), "");

writeFileSync(
  join(ROOT, "site.webmanifest"),
  JSON.stringify(
    {
      name: "Edge Trader Pro",
      short_name: "Edge Trader Pro",
      start_url: "./",
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

console.log(`Wrote ${pages.length} HTML pages, sitemap.xml, robots.txt, .nojekyll`);
