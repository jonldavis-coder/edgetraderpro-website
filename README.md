# Edge Trader Pro

Marketing site for Edge Trader Pro. It is a static site served from the repository root.

Live URL: https://jonldavis-coder.github.io/edgetraderpro-website/

The tagline is “Your rules. Your data. Your desk.” Pricing is not set. Access is a waitlist email to hello@edgetraderpro.com.

## Pages

Home, Features, Charts & Screeners, Practice (ProTrader MOSAIC), Journal, Rules & Risk, Access, FAQ, Support, Contact, Privacy (draft), Terms (draft), Thank you (noindex), Checkout canceled (noindex), Site map, and a 404 page.

## Develop

```bash
node scripts/build-site.mjs
npm test
python3 -m http.server 4173
```

`scripts/build-logo.py` redraws the SVG mark. `scripts/build-site.mjs` writes the HTML, `sitemap.xml`, `robots.txt`, and `.nojekyll`.

GitHub Pages serves the `main` branch from `/`. There is no custom domain.
