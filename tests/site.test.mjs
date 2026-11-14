import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import test from "node:test";

const ROOT = join(import.meta.dirname, "..");
const SKIP = new Set([".git", "node_modules", "tests"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, out);
    else if (/\.(html|css|js|mjs|svg|xml|txt|md|json|webmanifest)$/i.test(name)) out.push(path);
  }
  return out;
}

const files = walk(ROOT);

test("published copy does not say TraderBOT or trading bot", () => {
  const pattern = /trader\s*bot|trading\s+bots?/i;
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(relative(ROOT, file));
  }
  assert.deepEqual(hits, []);
});

test("published copy skips automation and order-routing claims", () => {
  const pattern = /automated trading|auto[-\s]?execution|kill switch|agent orders?/i;
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(relative(ROOT, file));
  }
  assert.deepEqual(hits, []);
});

const required = [
  "index.html",
  "features/index.html",
  "market/index.html",
  "journal/index.html",
  "research/index.html",
  "access/index.html",
  "faq/index.html",
  "support/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "thank-you/index.html",
  "checkout-canceled/index.html",
  "sitemap/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  ".nojekyll",
  "assets/js/checkout-config.js"
];

test("required pages and files exist", () => {
  for (const file of required) {
    assert.equal(statSync(join(ROOT, file)).isFile(), true, file);
  }
  const cname = readFileSync(join(ROOT, "CNAME"), "utf8").trim();
  assert.equal(cname, "edgedashpro.com");
  for (const retired of ["practice", "charts", "rules"]) {
    assert.equal(existsSync(join(ROOT, retired)), false, retired);
  }
});

test("thank-you and checkout-canceled are noindex", () => {
  for (const file of ["thank-you/index.html", "checkout-canceled/index.html"]) {
    const html = readFileSync(join(ROOT, file), "utf8");
    assert.match(html, /noindex/i);
  }
});

test("each HTML page has title, description, canonical, and Open Graph tags", () => {
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= 15);
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const rel = relative(ROOT, file);
    assert.match(html, /<title>[^<]+<\/title>/, rel);
    assert.match(html, /name="description"/, rel);
    assert.match(html, /rel="canonical"/, rel);
    assert.match(html, /property="og:title"/, rel);
    assert.match(html, /property="og:description"/, rel);
    assert.match(html, /property="og:url"/, rel);
    assert.match(html, /application\/ld\+json/, rel);
    assert.match(html, /https:\/\/edgedashpro\.com\//, rel);
    assert.doesNotMatch(html, /edgetraderpro\.com/i, rel);
    assert.doesNotMatch(html, /Edge Trader Pro/, rel);
    assert.match(html, /Automated assistant/, rel);
    assert.match(html, /not investment advice/, rel);
  }
});

test("paid checkout opens the app pricing page and waitlist falls back to mailto", () => {
  const js = readFileSync(join(ROOT, "assets/js/checkout-config.js"), "utf8");
  assert.match(js, /paidMonthly:\s*"https:\/\/app\.edgedashpro\.com\/pricing"/);
  assert.match(js, /paidAnnual:\s*"https:\/\/app\.edgedashpro\.com\/pricing"/);
  assert.match(js, /waitlist:\s*""/);
  assert.doesNotMatch(js, /\$\d/);
  assert.match(js, /mailto:hello@edgedashpro\.com/);
  assert.match(js, /return \{ href: config\.mailto, via: "mailto" \}/);
  const access = readFileSync(join(ROOT, "access/index.html"), "utf8");
  assert.match(access, /https:\/\/app\.edgedashpro\.com\/pricing/);
  assert.doesNotMatch(access, /Payment Links are empty/);
});

test("client scripts do not call the network", () => {
  for (const file of ["assets/js/site.js", "assets/js/checkout-config.js", "assets/js/assistant-knowledge.js"]) {
    const js = readFileSync(join(ROOT, file), "utf8");
    assert.doesNotMatch(js, /\bfetch\s*\(/);
    assert.doesNotMatch(js, /XMLHttpRequest/);
    assert.doesNotMatch(js, /WebSocket/);
    assert.doesNotMatch(js, /sendBeacon/);
  }
});

test("journal is the paid account journal", () => {
  const html = readFileSync(join(ROOT, "journal/index.html"), "utf8");
  assert.match(html, /Paid/);
  assert.match(html, /unified trade journal/);
  assert.match(html, /P&amp;L calendar/);
  assert.match(html, /post-trade insight cards/);
  assert.match(html, /user account/);
  assert.doesNotMatch(html, /On the roadmap/);
  assert.doesNotMatch(html, /Broker execution import/);
  assert.doesNotMatch(html, /MAE\/MFE/);
  assert.doesNotMatch(html, /\/practice\//);
});

test("pricing page states both tiers, Stripe slots, and no free trial", () => {
  const html = readFileSync(join(ROOT, "access/index.html"), "utf8");
  assert.match(html, /\$0/);
  assert.match(html, /\$69\/month/);
  assert.match(html, /\$29\/month/);
  assert.match(html, /\$497\/year/);
  assert.match(html, /\$297\/year/);
  assert.match(html, /Limited-time offer/);
  assert.match(html, /<s class="price-was">\$69\/month<\/s>/);
  assert.match(html, /<s class="price-was">\$497\/year<\/s>/);
  assert.match(html, /no free trial/i);
  assert.match(html, /data-checkout="paidMonthly"/);
  assert.match(html, /data-checkout="paidAnnual"/);
  assert.match(html, /data-checkout="waitlist"/);
  assert.match(html, /\$1–\$50 only/);
  assert.match(html, /float under 40M/);
  assert.match(html, /server-side/);
  assert.match(html, /not investment advice/);
  assert.doesNotMatch(html, /Pricing is not set/);
  assert.doesNotMatch(html, /\$29\.99/);
  assert.doesNotMatch(html, /\$259/);
  assert.doesNotMatch(html, /25-user launch/);
});

test("published copy has no limited-seat language", () => {
  const pattern = /25[- ]user|25 subscribers|launch cohort|limited[- ]seat|cohort of 25|holds 25|capped at 25/i;
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(relative(ROOT, file));
  }
  for (const file of ["scripts/build-site.mjs", "README.md"]) {
    const text = readFileSync(join(ROOT, file), "utf8");
    if (pattern.test(text)) hits.push(file);
  }
  assert.deepEqual(hits, []);
});

test("free Signals and filters are locked presets", () => {
  for (const file of [
    "index.html",
    "features/index.html",
    "market/index.html",
    "access/index.html",
    "faq/index.html",
    "assets/js/assistant-knowledge.js"
  ]) {
    const text = readFileSync(join(ROOT, file), "utf8");
    assert.match(text, /\$1–\$50 only|\$1–\$50 and float under 40M/, file);
    assert.match(text, /float under 40M/, file);
    assert.match(text, /Price Spike Up/, file);
    assert.match(text, /Price Spike Down/, file);
    assert.match(text, /5%/, file);
  }
  const features = readFileSync(join(ROOT, "features/index.html"), "utf8");
  assert.match(features, /cannot change or customize filters/);
  assert.match(features, /Interactive filter controls/);
  assert.match(features, /id="signals"/);
});

test("Squawk is a 7-day free-account trial, not a paid-plan trial", () => {
  for (const file of [
    "index.html",
    "features/index.html",
    "access/index.html",
    "faq/index.html",
    "assets/js/assistant-knowledge.js"
  ]) {
    const text = readFileSync(join(ROOT, file), "utf8");
    assert.match(text, /first 7 days/, file);
    assert.match(text, /free account/, file);
    assert.match(text, /no free trial/i, file);
    assert.doesNotMatch(text, /Squawk, with ads/, file);
    assert.doesNotMatch(text, /and browser-based Squawk\./, file);
  }
  const access = readFileSync(join(ROOT, "access/index.html"), "utf8");
  const freeCard = access.split("Paid monthly")[0];
  assert.match(freeCard, /no login/i);
  assert.match(freeCard, /first 7 days/);
  assert.doesNotMatch(freeCard, /Ad-free Squawk/);
});

test("launch copy omits removed scope", () => {
  const pattern =
    /watchlists?|mosaic|kcurve|schwab|demo mode|earnings|pro\s*trader\s*bot|traderbot|\/practice\/|\/charts\/|\/rules\//i;
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(relative(ROOT, file));
  }
  assert.deepEqual(hits, []);
});

test("internal links resolve to a file", () => {
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const missing = [];
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const dir = dirname(file);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(mailto:|https?:|tel:|#)/.test(href)) continue;
      const pathPart = href.split("#")[0];
      if (!pathPart) continue;
      const resolved = pathPart.endsWith("/")
        ? join(dir, pathPart, "index.html")
        : join(dir, pathPart);
      if (!existsSync(resolved)) missing.push(`${relative(ROOT, file)} -> ${href}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("sitemap lists public pages and omits noindex utility pages", () => {
  const xml = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  for (const path of ["", "features/", "market/", "journal/", "research/", "access/", "faq/", "support/", "contact/", "privacy/", "terms/", "sitemap/"]) {
    assert.match(xml, new RegExp("https://edgedashpro\\.com/" + path.replace("/", "\\/")));
  }
  assert.doesNotMatch(xml, /thank-you/);
  assert.doesNotMatch(xml, /checkout-canceled/);
  assert.doesNotMatch(xml, /\/practice\//);
  assert.doesNotMatch(xml, /\/charts\//);
  assert.doesNotMatch(xml, /\/rules\//);
  const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/edgedashpro\.com\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/thank-you\//);
  assert.match(robots, /Disallow: \/checkout-canceled\//);
});

test("published copy uses EdgeDashPro and hello@edgedashpro.com", () => {
  const pattern = /Edge Trader Pro|edgetraderpro\.com|jonldavis-coder\.github\.io/i;
  const hits = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(relative(ROOT, file));
  }
  for (const file of ["scripts/build-site.mjs", "scripts/build-logo.py", "README.md", "CNAME"]) {
    const text = readFileSync(join(ROOT, file), "utf8");
    if (pattern.test(text)) hits.push(file);
  }
  assert.deepEqual(hits, []);
  const home = readFileSync(join(ROOT, "index.html"), "utf8");
  assert.match(home, /EdgeDashPro/);
  assert.match(home, /hello@edgedashpro\.com/);
  assert.match(home, /This site does not publish performance/);
  assert.doesNotMatch(home, /eDP|monogram|mark\.svg|hero-logo/i);
  const favicon = readFileSync(join(ROOT, "assets/img/favicon.svg"), "utf8");
  assert.match(favicon, /aria-label="EDP"/);
  assert.doesNotMatch(favicon, /monogram/i);
});
