# EdgeDashPro

Marketing site for EdgeDashPro. It is a static site served from the repository root.

Live URL: https://edgedashpro.com/

The tagline is “Your rules. Your data. Your desk.”

Launch is two tiers:

- Free public pages: $0, no login, ad-supported, and read-only. Market, News, JAMSEC, Signals, Dilution, Stock Card, and Research. Every free view is locked server-side to $1–$50 only and float under 40M. Signals is locked to Price Spike Up and Price Spike Down at 5%. Visitors cannot change or customize filters.
- Squawk: a free account is required. Browser-based Squawk lasts for the first 7 days. After that, Squawk requires Paid and is ad-free.
- Paid: $29.99/month or $259/year, a 25-user launch, no free trial of the subscription. Continue to Paid Monthly and Continue to Paid Annual open https://app.edgedashpro.com/pricing. The waitlist button emails hello@edgedashpro.com.

## Pages

Home, Features, Market, Journal (paid), Research, Pricing and access, FAQ, Support, Contact, Privacy (draft), Terms (draft), Thank you (noindex), Checkout canceled (noindex), Site map, and a 404 page.

## Develop

```bash
node scripts/build-site.mjs
npm test
python3 -m http.server 4173
```

`scripts/build-logo.py` redraws the SVG mark. `scripts/build-site.mjs` writes the HTML, `sitemap.xml`, `robots.txt`, and `.nojekyll`.

GitHub Pages serves the `main` branch from `/`. The custom domain is edgedashpro.com.
