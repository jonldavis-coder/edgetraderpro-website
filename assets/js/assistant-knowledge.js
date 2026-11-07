/* Answers for the on-site assistant. Drawn only from this website's pages.
   The assistant does not load anything else. */
window.ETPKnowledge = [
  {
    keywords: ["what", "edge", "trader", "pro", "desk", "about", "product"],
    answer: "Edge Trader Pro is a web desk for people who trade their own plan. The wordmark is Edge Trader Pro. The tagline is Your rules. Your data. Your desk. Today the desk includes linked charts and workspaces, saved multi-pane screeners with presets, filters, and watchlists, the paper practice simulator ProTrader MOSAIC, a trade journal with editable rows and post-trade reviews, news, configurable alerts, squawk, market and sector context, and rule and risk controls with research cards and dilution analysis.",
    more: { slug: "features/", label: "Features" }
  },
  {
    keywords: ["advice", "invest", "investment", "risk", "loss", "guarantee", "disclaimer", "past", "results"],
    answer: "Edge Trader Pro is not investment advice. Trading involves risk of loss. Past results do not guarantee future results. This site does not publish profit, loss, win rate, or customer results.",
    more: { slug: "faq/", label: "FAQ" }
  },
  {
    keywords: ["real-time", "realtime", "feed", "feeds", "delayed", "connected", "data", "quote", "n/a"],
    answer: "This site does not describe the desk's data as universally connected or real-time. A field with no feed stays n/a. A quote that is delayed can show a delayed tag. Panels that are not connected stay grey. Some presets keep fields such as P/E, PEG, dividends, IPO date, depositary receipt, and technical rating as n/a when there is no feed.",
    more: { slug: "features/", label: "Features" }
  },
  {
    keywords: ["chart", "charts", "candle", "candles", "vwap", "macd", "volume", "workspace", "drawing"],
    answer: "Charts use a dark quote layout with the company and last price, candles, VWAP, volume, and MACD, plus drawing tools. A color link ties a chart to scanner panes, news, and details that share that color. A workspace saves the chart layout, scanner panes, link colors, signal and news colors, and squawk switches. You can save, save as, rename, duplicate, delete, set a default, and export or import the workspace as JSON.",
    more: { slug: "charts/", label: "Charts & Screeners" }
  },
  {
    keywords: ["screener", "screeners", "scanner", "preset", "filter", "filters", "pane", "panes", "watchlist"],
    answer: "Screeners run in one, two, three, or four panes. Each pane keeps its own preset, filters, tab, sort, and cooldown. Thirty-eight built-in screen presets ship with the desk. You can clone and edit a preset without replacing a built-in screen. Scanners save to the signed-in account. You can import a symbol list, including a TradingView export. Dated lists stay selectable. A name outside the price or float band can show an out-of-band tag when a quote or float is already cached.",
    more: { slug: "charts/", label: "Charts & Screeners" }
  },
  {
    keywords: ["mosaic", "practice", "simulator", "sim", "paper", "replay"],
    answer: "ProTrader MOSAIC is the practice simulator. It is paper-only. You can replay a session on a chart with candles, volume, VWAP, and an EMA, plus estimated limit-up and limit-down bands, paper fills, and order lines. It can open in its own window. A paper fill is not a live order. The simulator does not send a live order.",
    more: { slug: "practice/", label: "Practice" }
  },
  {
    keywords: ["journal", "review", "reviews", "edit", "row", "rows", "trade journal"],
    answer: "The current journal has editable rows and a reviews page for post-trade reviews. You keep the notes. The journal does not publish a profit figure on this website.",
    more: { slug: "journal/", label: "Journal" }
  },
  {
    keywords: ["roadmap", "calendar", "mae", "mfe", "mentor", "sharing", "broker", "import", "efficiency", "tag", "setup report"],
    answer: "On the roadmap, and not in the current desk: broker execution import, automatic journal capture, entry and exit marked on charts, reports by setup, tag, time, and price, a journal calendar, sharing and mentoring, and MAE/MFE and exit-efficiency analytics. These are journal plans only. They are not available today.",
    more: { slug: "journal/", label: "Journal" }
  },
  {
    keywords: ["rule", "rules", "risk", "float", "stop", "short", "borrow", "hours", "setup", "limit"],
    answer: "The desk shows risk rules: a $1 to $20 price band, float under 20 million shares, a share cap, a cap on open names, a daily loss limit, a stop on every trade, no short without a borrow, regular trading hours only, and a named setup. A rule on the screen does not remove market risk. Edge Trader Pro is not investment advice.",
    more: { slug: "rules/", label: "Rules & Risk" }
  },
  {
    keywords: ["dilution", "stock card", "research", "pdf", "scorecard", "offering"],
    answer: "Research cards include a stock card and a dilution scorecard. Dilution can show a risk bar and a 0 to 100 score, plus offering math. You can download a PDF. The last symbol for the account reopens unless the address bar names one. Some research cells, including short interest and borrow and locate, stay grey until a feed is connected.",
    more: { slug: "rules/", label: "Rules & Risk" }
  },
  {
    keywords: ["news", "squawk", "alert", "alerts", "signal", "halt", "headline", "moving"],
    answer: "News opens in an in-app reader with the feed summary, a Why It's Moving note, and the original link. A second news pane has its own filters. Squawk can read headlines and market alerts aloud, including Lost VWAP and Reclaimed VWAP. VWAP squawk starts off until you change it. Alerts are an inbox, a dilution feed, and rules. A signal is an alert row, not a trade. Halt up, halt down, and halt/resume are separate alert types.",
    more: { slug: "features/", label: "Features" }
  },
  {
    keywords: ["market", "sector", "heatmap", "heat", "etf", "context", "neutral"],
    answer: "Market overview stacks index cards, headlines, a theme heat map, a sector ETF heat map, and industry tiles such as pharma, biotech, semiconductors, regional banks, oil and gas, and gold miners. A bull and bear ETF tape sits with them. A context pill can read Favors shorts, Favors longs, or Neutral. That pill is context, not a signal. A move under half a percent reads Neutral. A tile can show a delayed tag.",
    more: { slug: "features/", label: "Features" }
  },
  {
    keywords: ["price", "pricing", "cost", "pay", "payment", "stripe", "waitlist", "access", "checkout", "buy"],
    answer: "Pricing is not set. Request access or join the waitlist by emailing hello@edgetraderpro.com. Stripe Payment Link slots on this site are empty, so the access buttons open that email. Custom setup services are available. Contact us. No price is listed for setup.",
    more: { slug: "access/", label: "Access" }
  },
  {
    keywords: ["custom", "setup", "service", "services", "contact", "email", "hello"],
    answer: "Custom setup services are available. Contact us at hello@edgetraderpro.com. No price is listed. Do not send account numbers, passwords, or API keys.",
    more: { slug: "contact/", label: "Contact" }
  },
  {
    keywords: ["support", "help", "broken", "question"],
    answer: "Support is by email at hello@edgetraderpro.com. This site does not promise a response time. Say what you were doing and what you expected. Do not include account numbers, passwords, or API keys.",
    more: { slug: "support/", label: "Support" }
  },
  {
    keywords: ["place", "trades", "trade for me", "orders", "live order", "brokerage"],
    answer: "No. You use the desk yourself. ProTrader MOSAIC is a paper practice simulator and does not send a live order. The journal records what you enter. This website does not offer a service that buys or sells for you.",
    more: { slug: "faq/", label: "FAQ" }
  },
  {
    keywords: ["assistant", "chat", "privacy", "cookie", "cookies", "data collection"],
    answer: "The automated assistant runs in your browser and answers from this website only. It does not send your question to another service. This marketing site does not run its own analytics and does not ask you to create an account. Email you choose to send goes to hello@edgetraderpro.com. Privacy and terms pages are drafts.",
    more: { slug: "privacy/", label: "Privacy" }
  },
  {
    keywords: ["demo", "tape", "signin", "sign-in", "login", "ipad", "workspace save"],
    answer: "The sign-in page carries the e/T pro mark. An admin can switch the desk tape to a demo tape. Demo adds a banner, and the desk asks before the switch. Layouts adapt on iPad: scanner panes stack when needed, and a saved chart layout is left as it is. A long idle period signs you out.",
    more: { slug: "features/", label: "Features" }
  },
  {
    keywords: ["mission", "status", "kcurve", "playbook", "training", "library"],
    answer: "Mission Control opens a desk overview with session gauges, a pre-flight list, and tiles into the rest of the desk. A status board reports component health. A feed that is not configured stays grey. A signed-in training library, kCURVE, holds a curated reading list and the playbook. Those files open only after sign-in.",
    more: { slug: "features/", label: "Features" }
  }
];
