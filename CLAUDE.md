# CLAUDE.md

Personal website of Ricardo Quintas (freelance SAP BTP architect / full-stack developer, Lisbon) — https://www.ricardoquintas.com

## What this is

A static site: plain HTML, CSS and JavaScript. No build step, no package manager, no tests. Files are served exactly as they are in the repo.

## Layout

- `index.html` — the main one-page site (sections: `#home` hero video, `#services`, `#about`, `#contact`). Includes SEO meta, Open Graph tags and JSON-LD structured data in `<head>`.
- `privacy.html` — privacy / cookie policy.
- `css/styles.css` — the site's own styles (on top of Bootstrap 3 + Font Awesome 4).
- `js/scripts.js` — vanilla JS for the main page: hero video start (desktop only, respects reduced motion), scroll reveal animations, skill bars, nav toggle, smooth scroll and scroll-spy.
- `js/consent.js` — cookie banner + Google Analytics 4. GA is loaded **only after consent**; the choice is stored in `localStorage` (`rq-cookie-consent`). Included on every page.
- `images/` — site images (`ricardo.jpg` is the About photo, 445×593; `og-image.jpg` is the social share image).
- `videos/video02/` — hero background video: `video.webm` (AV1) + `video-720.mp4` fallback, `cover-720.jpg` poster.
- `docs/` — favicons and touch icons (the PSD design sources are git-ignored).
- `portfolio/` — separate portfolio page. Projects are data in `portfolio/js/projects.js`, rendered and filtered in vanilla JS (`portfolio/js/app.js`), laid out with Masonry + imagesLoaded (no jQuery), loaded in batches on scroll. Thumbnails live in `portfolio/img/`.
- `portfolio/santinho`, `portfolio/sca`, `portfolio/unplace` — old self-contained project demos.
- `robots.txt`, `sitemap.xml` — SEO. Update `<lastmod>` in the sitemap when pages change.

The main pages use no jQuery: `js/` holds only `scripts.js` and `consent.js`. Design sources (`*.psd`) and video masters (`*.mov`) are kept locally but git-ignored, so they never reach the repo or the server.

## Conventions

- Keep it dependency-free: no bundlers, frameworks or npm. Vanilla JS for new code on the main page.
- Custom CSS classes use the `zrq-` prefix.
- Use relative paths so the site works both on the real domain and on GitHub Pages (`/ricardoquintas.com/` sub-path).
- When replacing an image, keep the same dimensions as the original unless asked otherwise.
- Any new page must include `js/consent.js` (with the correct relative path) so analytics stays consent-gated, and should be added to `sitemap.xml`.
- Don't add third-party trackers or scripts that set cookies without going through the consent banner.

## Running locally

Open `index.html` directly, or serve the folder, e.g. `python -m http.server 8000`, and visit http://localhost:8000.

## Deploying

- Production: Netlify deploys automatically on every push to `master` on GitHub (no build step, no Netlify config in the repo). Pushing is deploying, so only commit/push when the user asks.
- The same push also publishes the GitHub Pages preview at https://rdquintas.github.io/ricardoquintas.com
