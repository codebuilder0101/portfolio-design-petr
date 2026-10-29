/**
 * Authoritative project dataset (projects 31–60).
 *
 * Structural data lives here; localized copy (specialty, brief, alt text…) lives in
 * ./content/<locale>.ts and is merged by getProject()/getProjects().
 * To add a project: add media to source/media, run `npm run media`, add an entry
 * below, and add matching content in every locale file (TypeScript enforces this).
 */
import type { Locale } from "@/i18n/config";
import manifest from "./media-manifest.json";
import { content, type ProjectContent } from "./content";

export const categoryIds = ["product", "portrait", "lifestyle", "sports", "compositing", "corporate"] as const;
export type CategoryId = (typeof categoryIds)[number];

export const tagIds = [
  "retouching", "compositing", "color", "product", "macro", "motion", "short-form", "portrait",
  "food", "sports", "automotive", "3d", "restoration", "social", "e-commerce", "aerial", "editing",
] as const;
export type TagId = (typeof tagIds)[number];

/** Drives which case-study layout and focus notes a project receives. */
export type Variant = "detail" | "beauty" | "product" | "composite" | "portrait" | "motion" | "sports";

/** Percent coordinates inside the still image. */
export type Point = { x: number; y: number };

type ProjectSource = {
  id: number;
  slug: string;
  /** Brand/project names stay identical in every language. */
  title: string;
  /** First entry is the primary category. */
  categories: CategoryId[];
  tags: TagId[];
  /** Suggested production stack, as listed in PROJECTS.md. */
  stack: string[];
  featured?: boolean;
  variant: Variant;
  /** Focal point for tall/square crops. */
  focus: Point;
  /** Detail crops shown on the case study (zoomed regions of the same artwork). */
  details: Point[];
  /** Accent used for small UI touches on this project. */
  accent: "cobalt" | "citrus" | "coral" | "mint";
};

const sources: ProjectSource[] = [
  { id: 31, slug: "night-shift", title: "Night Shift", categories: ["compositing", "product"], tags: ["automotive", "compositing", "color", "product"], stack: ["Photoshop", "Lightroom", "After Effects"], variant: "composite", focus: { x: 38, y: 60 }, details: [{ x: 56, y: 55 }, { x: 28, y: 88 }], accent: "cobalt" },
  { id: 32, slug: "silver-line", title: "Silver Line", categories: ["portrait", "product"], tags: ["macro", "retouching", "product", "e-commerce"], stack: ["Photoshop", "Capture One", "After Effects"], featured: true, variant: "detail", focus: { x: 44, y: 44 }, details: [{ x: 42, y: 40 }, { x: 72, y: 62 }], accent: "cobalt" },
  { id: 33, slug: "skin-stories", title: "Skin Stories", categories: ["portrait"], tags: ["retouching", "portrait", "color"], stack: ["Photoshop", "Lightroom", "DaVinci Resolve"], featured: true, variant: "beauty", focus: { x: 50, y: 32 }, details: [{ x: 50, y: 24 }, { x: 54, y: 50 }], accent: "coral" },
  { id: 34, slug: "airborne", title: "Airborne", categories: ["product", "sports", "compositing"], tags: ["product", "compositing", "sports", "3d"], stack: ["Photoshop", "Blender", "After Effects"], featured: true, variant: "product", focus: { x: 68, y: 40 }, details: [{ x: 66, y: 28 }, { x: 22, y: 78 }], accent: "citrus" },
  { id: 35, slug: "fizz-club", title: "Fizz Club", categories: ["product", "lifestyle"], tags: ["product", "food", "social", "retouching"], stack: ["Photoshop", "Lightroom", "Premiere Pro"], featured: true, variant: "product", focus: { x: 56, y: 40 }, details: [{ x: 50, y: 38 }, { x: 82, y: 22 }], accent: "coral" },
  { id: 36, slug: "sync-buds", title: "Sync Buds", categories: ["product", "compositing"], tags: ["product", "3d", "macro", "e-commerce"], stack: ["Blender", "Cycles", "After Effects"], variant: "product", focus: { x: 70, y: 45 }, details: [{ x: 80, y: 24 }, { x: 70, y: 62 }], accent: "citrus" },
  { id: 37, slug: "court-time", title: "Court Time", categories: ["sports"], tags: ["sports", "color", "editing", "social"], stack: ["Photoshop", "Lightroom", "Premiere Pro"], featured: true, variant: "sports", focus: { x: 50, y: 48 }, details: [{ x: 14, y: 24 }, { x: 52, y: 44 }], accent: "cobalt" },
  { id: 38, slug: "concrete-friday", title: "Concrete Friday", categories: ["sports", "lifestyle"], tags: ["short-form", "editing", "sports", "color"], stack: ["Premiere Pro", "DaVinci Resolve", "Photoshop"], variant: "motion", focus: { x: 60, y: 36 }, details: [{ x: 50, y: 18 }, { x: 46, y: 46 }], accent: "cobalt" },
  { id: 39, slug: "front-row", title: "Front Row", categories: ["sports", "lifestyle"], tags: ["editing", "color", "motion", "short-form"], stack: ["Premiere Pro", "DaVinci Resolve", "After Effects"], variant: "motion", focus: { x: 60, y: 38 }, details: [{ x: 60, y: 30 }, { x: 20, y: 62 }], accent: "coral" },
  { id: 40, slug: "lunch-break", title: "Lunch Break", categories: ["lifestyle", "product"], tags: ["food", "editing", "motion", "social"], stack: ["Premiere Pro", "After Effects", "Photoshop"], variant: "motion", focus: { x: 60, y: 40 }, details: [{ x: 62, y: 30 }, { x: 18, y: 52 }], accent: "mint" },
  { id: 41, slug: "carry-light", title: "Carry Light", categories: ["product", "lifestyle"], tags: ["product", "e-commerce", "retouching"], stack: ["Photoshop", "Lightroom", "Blender"], variant: "product", focus: { x: 54, y: 58 }, details: [{ x: 54, y: 52 }, { x: 34, y: 82 }], accent: "coral" },
  { id: 42, slug: "soft-spot", title: "Soft Spot", categories: ["product"], tags: ["product", "e-commerce", "retouching", "3d"], stack: ["Photoshop", "Blender", "Capture One"], featured: true, variant: "product", focus: { x: 56, y: 52 }, details: [{ x: 40, y: 40 }, { x: 62, y: 84 }], accent: "cobalt" },
  { id: 43, slug: "memory-lab", title: "Memory Lab", categories: ["lifestyle", "portrait"], tags: ["restoration", "color", "retouching"], stack: ["Photoshop", "Lightroom"], variant: "portrait", focus: { x: 28, y: 48 }, details: [{ x: 50, y: 62 }, { x: 22, y: 30 }], accent: "citrus" },
  { id: 44, slug: "good-dog-day", title: "Good Dog Day", categories: ["lifestyle"], tags: ["retouching", "social", "color"], stack: ["Photoshop", "Lightroom", "Premiere Pro"], featured: true, variant: "detail", focus: { x: 50, y: 40 }, details: [{ x: 40, y: 22 }, { x: 52, y: 50 }], accent: "mint" },
  { id: 45, slug: "field-logic", title: "Field Logic", categories: ["corporate"], tags: ["aerial", "color", "editing", "motion"], stack: ["DaVinci Resolve", "Premiere Pro", "After Effects"], variant: "motion", focus: { x: 60, y: 30 }, details: [{ x: 60, y: 30 }, { x: 30, y: 70 }], accent: "mint" },
  { id: 46, slug: "built-to-move", title: "Built to Move", categories: ["corporate", "product"], tags: ["product", "3d", "motion"], stack: ["Blender", "After Effects", "Premiere Pro"], variant: "product", focus: { x: 58, y: 48 }, details: [{ x: 58, y: 50 }, { x: 84, y: 22 }], accent: "coral" },
  { id: 47, slug: "people-first", title: "People First", categories: ["corporate", "portrait"], tags: ["portrait", "retouching", "color"], stack: ["Lightroom", "Photoshop", "Premiere Pro"], variant: "portrait", focus: { x: 44, y: 42 }, details: [{ x: 44, y: 32 }, { x: 72, y: 50 }], accent: "mint" },
  { id: 48, slug: "one-more-rep", title: "One More Rep", categories: ["sports", "lifestyle"], tags: ["sports", "editing", "motion", "short-form"], stack: ["Premiere Pro", "After Effects", "DaVinci Resolve"], variant: "motion", focus: { x: 74, y: 44 }, details: [{ x: 76, y: 22 }, { x: 74, y: 82 }], accent: "coral" },
  { id: 49, slug: "everyday-review", title: "Everyday Review", categories: ["lifestyle", "product"], tags: ["social", "short-form", "editing", "product"], stack: ["Premiere Pro", "After Effects", "Photoshop"], variant: "motion", focus: { x: 36, y: 40 }, details: [{ x: 26, y: 42 }, { x: 40, y: 30 }], accent: "mint" },
  { id: 50, slug: "satisfy", title: "Satisfy", categories: ["product", "lifestyle"], tags: ["macro", "product", "short-form"], stack: ["Photoshop", "Premiere Pro", "DaVinci Resolve"], variant: "detail", focus: { x: 50, y: 46 }, details: [{ x: 26, y: 62 }, { x: 74, y: 52 }], accent: "coral" },
  { id: 51, slug: "studio-eight", title: "Studio Eight", categories: ["sports"], tags: ["editing", "color", "short-form"], stack: ["Premiere Pro", "DaVinci Resolve", "After Effects"], variant: "motion", focus: { x: 50, y: 50 }, details: [{ x: 48, y: 30 }, { x: 22, y: 60 }], accent: "citrus" },
  { id: 52, slug: "tiny-makers", title: "Tiny Makers", categories: ["product", "compositing"], tags: ["motion", "product", "3d"], stack: ["Dragonframe", "After Effects", "Photoshop"], variant: "detail", focus: { x: 40, y: 50 }, details: [{ x: 36, y: 34 }, { x: 34, y: 82 }], accent: "cobalt" },
  { id: 53, slug: "open-house-human", title: "Open House Human", categories: ["corporate", "portrait"], tags: ["portrait", "retouching", "color"], stack: ["Lightroom", "Photoshop", "Premiere Pro"], variant: "portrait", focus: { x: 36, y: 44 }, details: [{ x: 36, y: 30 }, { x: 78, y: 30 }], accent: "cobalt" },
  { id: 54, slug: "class-of-now", title: "Class of Now", categories: ["lifestyle"], tags: ["editing", "motion", "portrait", "social"], stack: ["Premiere Pro", "After Effects", "Lightroom"], variant: "motion", focus: { x: 50, y: 40 }, details: [{ x: 56, y: 32 }, { x: 88, y: 10 }], accent: "mint" },
  { id: 55, slug: "parallel-lives", title: "Parallel Lives", categories: ["compositing"], tags: ["compositing", "color"], stack: ["Photoshop", "Illustrator", "After Effects"], variant: "composite", focus: { x: 45, y: 36 }, details: [{ x: 44, y: 26 }, { x: 46, y: 74 }], accent: "coral" },
  { id: 56, slug: "fresh-cut", title: "Fresh Cut", categories: ["portrait", "lifestyle"], tags: ["retouching", "portrait", "social"], stack: ["Photoshop", "Lightroom", "Premiere Pro"], variant: "beauty", focus: { x: 56, y: 40 }, details: [{ x: 52, y: 20 }, { x: 60, y: 54 }], accent: "cobalt" },
  { id: 57, slug: "material-matters", title: "Material Matters", categories: ["product"], tags: ["macro", "product", "e-commerce", "color"], stack: ["Photoshop", "Blender", "DaVinci Resolve"], variant: "detail", focus: { x: 50, y: 50 }, details: [{ x: 12, y: 22 }, { x: 70, y: 26 }, { x: 76, y: 80 }], accent: "mint" },
  { id: 58, slug: "screen-scene", title: "Screen Scene", categories: ["compositing", "corporate"], tags: ["compositing", "motion", "product"], stack: ["After Effects", "Mocha", "Photoshop", "Premiere Pro"], variant: "composite", focus: { x: 36, y: 50 }, details: [{ x: 32, y: 40 }, { x: 70, y: 66 }], accent: "coral" },
  { id: 59, slug: "second-nature", title: "Second Nature", categories: ["compositing", "portrait"], tags: ["compositing", "portrait", "color", "retouching"], stack: ["Photoshop", "Lightroom", "After Effects"], featured: true, variant: "composite", focus: { x: 56, y: 50 }, details: [{ x: 60, y: 28 }, { x: 52, y: 78 }], accent: "coral" },
  { id: 60, slug: "small-world-kitchen", title: "Small World Kitchen", categories: ["compositing", "product"], tags: ["compositing", "food", "3d"], stack: ["Photoshop", "Blender", "After Effects"], variant: "composite", focus: { x: 56, y: 56 }, details: [{ x: 22, y: 72 }, { x: 88, y: 40 }], accent: "citrus" },
];

type ManifestEntry = {
  width: number;
  height: number;
  color: string;
  imageWidths: number[];
  gif: { width: number; height: number } | null;
  video: { width: number; height: number; duration: number; posterWidths: number[] } | null;
};

export type ResponsiveSource = {
  /** Path prefix: `${base}-${width}.avif|webp` */
  base: string;
  widths: number[];
  width: number;
  height: number;
};

export type ProjectMedia = {
  color: string;
  image: ResponsiveSource;
  /** Untouched full-resolution original. */
  full: string;
  gif: { src: string; width: number; height: number } | null;
  video: { src: string; width: number; height: number; duration: number; poster: ResponsiveSource; posterJpg: string } | null;
};

export type Project = Omit<ProjectSource, "featured"> & {
  number: string;
  featured: boolean;
  /** AI-generated concept artwork — always true for this collection. */
  concept: true;
  media: ProjectMedia;
  content: ProjectContent;
};

function mediaFor(id: number): ProjectMedia {
  const m = (manifest as Record<string, ManifestEntry>)[String(id)];
  const dir = `/media/${id}`;
  if (!m) {
    // Missing media entry: return paths anyway so components fall back gracefully.
    return {
      color: "#d9d6cf",
      image: { base: `${dir}/image`, widths: [1080], width: 1536, height: 1024 },
      full: `${dir}/full.jpg`,
      gif: null,
      video: null,
    };
  }
  return {
    color: m.color,
    image: { base: `${dir}/image`, widths: m.imageWidths, width: m.width, height: m.height },
    full: `${dir}/full.jpg`,
    gif: m.gif ? { src: `${dir}/motion.gif`, ...m.gif } : null,
    video: m.video
      ? {
          src: `${dir}/motion.mp4`,
          width: m.video.width,
          height: m.video.height,
          duration: m.video.duration,
          poster: { base: `${dir}/poster`, widths: m.video.posterWidths, width: m.video.width, height: m.video.height },
          posterJpg: `${dir}/poster.jpg`,
        }
      : null,
  };
}

function build(source: ProjectSource, locale: Locale): Project {
  return {
    ...source,
    number: String(source.id).padStart(2, "0"),
    featured: !!source.featured,
    concept: true,
    media: mediaFor(source.id),
    content: content[locale][source.id],
  };
}

export const projectSlugs = sources.map((p) => p.slug);

export function getProjects(locale: Locale): Project[] {
  return sources.map((s) => build(s, locale));
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  const source = sources.find((s) => s.slug === slug);
  return source ? build(source, locale) : undefined;
}

export function getProjectsByIds(locale: Locale, ids: number[]): Project[] {
  return ids.map((id) => sources.find((s) => s.id === id)).filter(Boolean).map((s) => build(s!, locale));
}

/** Previous/next in collection order, wrapping around. */
export function getNeighbours(locale: Locale, slug: string) {
  const i = sources.findIndex((s) => s.slug === slug);
  const prev = sources[(i - 1 + sources.length) % sources.length];
  const next = sources[(i + 1) % sources.length];
  return { prev: build(prev, locale), next: build(next, locale) };
}

/** Projects sharing the most categories/tags with the given one. */
export function getRelated(locale: Locale, slug: string, count = 3): Project[] {
  const me = sources.find((s) => s.slug === slug);
  if (!me) return [];
  return sources
    .filter((s) => s.slug !== slug)
    .map((s) => ({
      s,
      score:
        s.categories.filter((c) => me.categories.includes(c)).length * 3 +
        (s.categories[0] === me.categories[0] ? 2 : 0) +
        s.tags.filter((t) => me.tags.includes(t)).length +
        (s.variant === me.variant ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.s.id - b.s.id)
    .slice(0, count)
    .map(({ s }) => build(s, locale));
}

export function countByCategory(): Record<CategoryId, number> {
  const counts = Object.fromEntries(categoryIds.map((c) => [c, 0])) as Record<CategoryId, number>;
  for (const s of sources) for (const c of s.categories) counts[c]++;
  return counts;
}

/** Every tool referenced across the collection, with how many briefs reference it. */
export function toolUsage(): { tool: string; count: number }[] {
  const map = new Map<string, number>();
  for (const s of sources) for (const t of s.stack) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()].map(([tool, count]) => ({ tool, count })).sort((a, b) => b.count - a.count || a.tool.localeCompare(b.tool));
}

/** Curated picks used on the home page. */
export const HERO_IDS = [35, 34, 31, 59, 42];
export const FEATURED_ORDER = [35, 32, 34, 59, 31, 42, 37, 44];
export const MOTION_SHOWCASE_IDS = [34, 38, 40, 59, 45];

/** Representative thumbnails for each category on the "find work" index. */
export const CATEGORY_PICKS: Record<CategoryId, number[]> = {
  product: [34, 42, 36],
  portrait: [59, 32, 56],
  lifestyle: [44, 40, 49],
  sports: [37, 38, 51],
  compositing: [59, 60, 55],
  corporate: [46, 47, 45],
};
