/**
 * Portraits of Petr Smital. Crops are defined in scripts/build-media.mjs (PORTRAITS)
 * and generated from the originals in source/img by `npm run media`.
 */
import type { ResponsiveSource } from "./projects";
import manifest from "./portrait-manifest.json";

type Entry = { width: number; height: number; color: string; imageWidths: number[] };
export type Portrait = { image: ResponsiveSource; color: string };

function portrait(name: keyof typeof manifest): Portrait {
  const m: Entry = manifest[name];
  return { image: { base: `/media/petr/${name}`, widths: m.imageWidths, width: m.width, height: m.height }, color: m.color };
}

export const portraits = {
  /** 4:5, yellow hoodie — home hero. */
  hero: portrait("hero"),
  /** Square face crop — avatar chip. */
  avatar: portrait("avatar"),
  /** 4:5, dark suit — About page. */
  about: portrait("about"),
};
