# Petr Smital — Portfolio

Portfolio of Petr Smital, a senior photo, image and video editor and AI visual creator. It covers 30 concept projects (31–60, *Night Shift* through *Small World Kitchen*) in Brazilian Portuguese, Spanish and English.

Built with Next.js 16 (App Router, static export), TypeScript, Tailwind CSS 4, Motion for React and Lucide icons.

---

## Requirements

- Node.js **20.9 or newer** (tested with 22.23)
- npm 10+

## Install and run

```bash
npm install                 # dependencies
npm run dev                 # development server → http://localhost:3000
```

The optimized media in `public/media` and the brand assets are already generated. You only need to regenerate them after changing the source media (see [Media pipeline](#media-pipeline)).

## Production build

```bash
npm run build               # static export → ./out (also runs scripts/postbuild.mjs)
npm run preview             # serves ./out → http://localhost:4173
```

`./out` is a plain static site. You can deploy it to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx…). Configure the host to serve `404.html` for unknown paths.

**Set your real domain before building for production.** It is used for canonical URLs, `hreflang`, Open Graph and JSON-LD:

```bash
# macOS / Linux
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
# Windows PowerShell
$env:NEXT_PUBLIC_SITE_URL="https://your-domain.com"; npm run build
```

Without it, URLs fall back to `http://localhost:3000` and the pages are marked `noindex`, so a preview build is never indexed by mistake.

## Quality checks

```bash
npm run typecheck           # route types + tsc --noEmit
npm run lint                # ESLint (next/core-web-vitals + TypeScript)
npx playwright install chromium   # first time only
npm run test:e2e            # functional tests against ./out (run `npm run build` first)
npm run check               # all of the above in sequence
```

---

## Project structure

```
source/                 Original supplied files — never modified
  img/petr-*.png        Portraits of Petr (crops are generated into img/crops/)
  media/31–60.{jpg,gif,mp4}
  PROJECTS.md           Original briefs
  legacy-index.html     The previous single-page listing
public/
  media/<id>/           Generated web media (see below)
  og/og-{en,pt,es}.png  1200×630 Open Graph images
  favicon.svg, favicon.ico, favicon-16/32.png, apple-touch-icon.png, icon-192/512.png
scripts/
  build-media.mjs       Responsive AVIF/WebP, poster frames, media manifest
  build-brand.mjs       Favicons, manifest, Open Graph images
  postbuild.mjs         Static-export fix-up for prefetch files
  serve.mjs             Dependency-free static preview server
src/
  app/
    (entry)/            "/" → picks the language (saved → browser → English)
    [locale]/           All pages: home, work, work/[slug], expertise, process, about
    global-not-found.tsx  Trilingual 404
  components/           layout/, home/, work/, project/, media/, ui/
  config/site.ts        Name, Workana profile URL and site URL
  data/
    projects.ts         ★ Authoritative project dataset
    content/{en,pt,es}.ts  Localized project copy
    media-manifest.json Generated: dimensions, colors, available sizes
  i18n/
    config.ts           Locales, selector order, helpers
    dictionaries/{en,pt,es}.ts  All interface text
e2e/site.spec.ts        Playwright functional tests
```

## Editing projects

All project data lives in **`src/data/projects.ts`**. Each entry holds:

| Field | Purpose |
| --- | --- |
| `id`, `slug`, `title` | Number, URL slug and brand name (the title stays the same in every language) |
| `categories` | One or more of `product`, `portrait`, `lifestyle`, `sports`, `compositing`, `corporate`. The first one is the primary category |
| `tags` | Searchable specialties (vocabulary in `tagIds`) |
| `stack` | Suggested production stack, shown as "Suggested Production Stack" |
| `featured` | Marks a strong piece (the home-page selection is `FEATURED_ORDER`) |
| `variant` | Case-study layout: `detail`, `beauty`, `product`, `composite`, `portrait`, `motion`, `sports` |
| `focus` | Focal point (x/y %) for tall and square crops |
| `details` | Zoomed detail crops shown on the case study (x/y % in the same artwork) |
| `accent` | `cobalt`, `citrus`, `coral` or `mint`, used for small UI touches |

The image, GIF, video and poster paths, dimensions and alt text are added automatically (`project.media`, `project.content`). Every project is labeled as a concept (`concept: true`).

Home-page curation is at the bottom of the same file: `HERO_IDS`, `FEATURED_ORDER`, `MOTION_SHOWCASE_IDS` and `CATEGORY_PICKS`.

**Localized project copy** lives in `src/data/content/en.ts`, `pt.ts` and `es.ts`. Each project has `specialty`, `summary`, `brief`, `use`, `direction`, `alt` and `detailCaptions`. TypeScript requires every locale file to cover the same projects.

### Adding a project

1. Put `NN.jpg`, `NN.gif` and `NN.mp4` in `source/media/`.
2. Run `npm run media`.
3. Add an entry to `sources` in `src/data/projects.ts`.
4. Add the copy for `NN` to all three files in `src/data/content/`.
5. Run `npm run typecheck`, then `npm run build`.

## Editing translations

Interface text lives in `src/i18n/dictionaries/`:

- `en.ts` is the reference. Its shape defines the `Dictionary` type.
- `pt.ts` (Brazilian Portuguese) and `es.ts` must match that shape, or the type check fails.

Keep `{placeholders}` such as `{count}` and `{title}` intact. To change the displayed name, edit `src/config/site.ts` (and `NAME` in `scripts/build-brand.mjs`, then run `npm run brand`).

## Hiring link

Clients are pointed to the Workana profile set in `site.hire.url` (`src/config/site.ts`). The link appears in the header ("Hire me"), the mobile menu, the footer, the closing section of each page and the About page, always opening in a new tab. Its wording lives in the `hire` section of each dictionary. The case-study JSON-LD names Petr Smital as a `Person` with the profile in `sameAs`.

How language is chosen:
- `/` picks a language: **saved choice** (localStorage key `frame-motion-locale`), then **browser language**, then **English**.
- The **PT | ES | EN** selector keeps the current page, filters and hash, saves the choice and updates `<html lang>`.
- Each language has its own URL (`/pt/…`, `/es/…`, `/en/…`) with localized metadata and `hreflang` alternates.

## Portraits

The portraits of Petr come from `source/img/` (`petr-hoodie.png`, `petr-suit.png`). `npm run media` cuts three crops, defined in `PORTRAITS` in `scripts/build-media.mjs`, and writes responsive AVIF/WebP files to `public/media/petr/` and `src/data/portrait-manifest.json`:

| Crop | Used for |
| --- | --- |
| `hero` (4:5, hoodie) | Portrait card in the home hero and the Open Graph images |
| `avatar` (square, hoodie) | "Hi, I'm Petr Smital" avatar above the hero headline |
| `about` (4:5, suit) | About page header |

To use a different photo, replace the file in `source/img/`, adjust the crop box (pixels in the original) and run `npm run media`, then `npm run brand`.

## Media pipeline

`npm run media` reads `source/media` and writes `public/media/<id>/`:

| File | Use |
| --- | --- |
| `image-{480,768,1080,1536}.{avif,webp}` | Responsive `<picture>` sources, plus a native-width variant |
| `full.jpg` | Byte-identical copy of the original, used by the full-size viewer |
| `poster.jpg`, `poster-{640,1280}.{avif,webp}` | Poster frame taken at 4.2 s, the typographic layout frame of each motion study |
| `motion.mp4`, `motion.gif` | Copies of the supplied motion files |

Only missing or outdated files are rebuilt (`npm run media -- --force` rebuilds everything). `npm run brand` regenerates favicons and the Open Graph images. The OG text uses system fonts (Segoe UI, then Arial), so rendering can differ slightly between machines.

Loading behavior:
- Images are lazy-loaded below the fold and always have explicit dimensions.
- MP4s use `preload="none"` and a poster image, and load only when the visitor presses play.
- GIFs load only on desktop hover (as a small inset preview) or after an explicit "Load GIF preview" click.

## Content honesty

The still images are **AI-generated concept artwork**. The MP4/GIF files are **silent graphic motion studies** made from those stills; they are not filmed footage. The site labels every project "Concept Project", calls the tooling "Suggested Production Stack", and states this in short disclosures on the work page, every case study and the About page. It claims no clients, testimonials, awards, results, before/after comparisons or proficiency levels, and the only personal details shown are the name and the Workana profile link.
