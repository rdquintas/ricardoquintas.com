# [ricardoquintas.com](https://www.ricardoquintas.com)

Source of my personal website: who I am, what I do and a portfolio of projects.

It's a static site (HTML, CSS and vanilla JavaScript). Nothing is built on deploy; the only tooling is a local script that converts images to AVIF + WebP.

- **Live (Netlify):** https://www.ricardoquintas.com
- **Preview (GitHub Pages, branch `master`):** https://rdquintas.github.io/ricardoquintas.com

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Main one-page site (hero video, services, about, contact) |
| `privacy.html` | Privacy and cookie policy |
| `portfolio/` | Portfolio page. Projects are listed in `portfolio/js/projects.js` |
| `css/styles.css` | Site styles (on top of Bootstrap 3 and Font Awesome) |
| `js/scripts.js` | Main page behaviour (video, animations, navigation) |
| `js/consent.js` | Cookie banner. Google Analytics only loads after the visitor accepts |
| `images/`, `videos/`, `docs/` | Images, hero video and favicons |
| `tools/build-images.py` | Converts images to AVIF with a WebP fallback |
| `robots.txt`, `sitemap.xml` | SEO |

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python -m http.server 8000
```

Then go to http://localhost:8000.

## Images

The pages only use AVIF images, with WebP as the fallback. Keep the original `.jpg`/`.png`/`.gif` in `images/`, `portfolio/img/` or `videos/video02/` and generate the optimized versions:

```sh
pip install -r tools/requirements.txt   # once (Pillow)
python tools/build-images.py            # new / changed images only
python tools/build-images.py --force    # rebuild everything
```

This writes `<name>.avif` and `<name>.webp` next to each original. Commit them along with the original.

## Adding a portfolio project

1. Add a thumbnail to `portfolio/img/` and run `python tools/build-images.py`.
2. Add an entry to the `projects` array in `portfolio/js/projects.js` (`name`, `description`, `image`, `url`, `skills`). `image` is the original file name (e.g. `tuba.png`); the page loads the `.avif`/`.webp`.

## Deploy

Netlify deploys the site automatically on every push to `master`. Nothing is built: the files are served exactly as they are in the repo.

```sh
git commit -am "Describe the change"
git push
```

Only files tracked by git are deployed. Design sources (`*.psd`) and video masters (`*.mov`) are git-ignored, so they stay on your machine.
