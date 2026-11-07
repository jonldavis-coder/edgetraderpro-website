import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
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
  "charts/index.html",
  "practice/index.html",
  "journal/index.html",
  "rules/index.html",
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
  assert.equal(existsSync(join(ROOT, "CNAME")), false);
});

test("thank-you and checkout-canceled are noindex", () => {
  for (const file of ["thank-you/index.html", "checkout-canceled/index.html"]) {
    const html = readFileSync(join(ROOT, file), "utf8");
    assert.match(html, /noindex/i);
  }
});

test("each HTML page has title, description, canonical, and Open Graph tags", () => {
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= 16);
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
    assert.match(html, /https:\/\/jonldavis-coder\.github\.io\/edgetraderpro-website\//, rel);
    assert.match(html, /Automated assistant/, rel);
    assert.match(html, /not investment advice/, rel);
  }
});

test("Stripe Payment Link slots are empty and fall back to mailto", () => {
  const js = readFileSync(join(ROOT, "assets/js/checkout-config.js"), "utf8");
  assert.match(js, /access:\s*""/);
  assert.match(js, /waitlist:\s*""/);
  assert.match(js, /customSetup:\s*""/);
  assert.match(js, /mailto:hello@edgetraderpro.com/);
  assert.match(js, /return \{ href: config\.mailto, via: "mailto" \}/);
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

test("journal roadmap is labeled and not mixed into the current list", () => {
  const html = readFileSync(join(ROOT, "journal/index.html"), "utf8");
  assert.match(html, /On the roadmap/);
  assert.match(html, /Not in the current desk/);
  assert.match(html, /Broker execution import/);
  assert.match(html, /Automatic journal capture/);
  assert.match(html, /MAE\/MFE/);
  const current = html.split("On the roadmap")[0];
  assert.doesNotMatch(current, /Broker execution import/);
  assert.doesNotMatch(current, /journal calendar/i);
});

test("sitemap lists public pages and omits noindex utility pages", () => {
  const xml = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  for (const path of ["", "features/", "charts/", "practice/", "journal/", "rules/", "access/", "faq/", "support/", "contact/", "privacy/", "terms/", "sitemap/"]) {
    assert.match(xml, new RegExp("edgetraderpro-website/" + path.replace("/", "\\/") ));
  }
  assert.doesNotMatch(xml, /thank-you/);
  assert.doesNotMatch(xml, /checkout-canceled/);
  const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/jonldavis-coder\.github\.io\/edgetraderpro-website\/sitemap\.xml/);
});
