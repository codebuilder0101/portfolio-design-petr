/**
 * Identity. `name` is used in the header, footer, metadata and Open Graph images
 * (also update `NAME` in scripts/build-brand.mjs and run `npm run brand`).
 */
export const site = {
  name: "Petr Smital",
  shortName: "Petr Smital",
  /** Public freelance profile where clients can hire Petr. */
  hire: {
    platform: "Workana",
    url: "https://www.workana.com/freelancer/ced96263bb765dfc68b6aaabbad659dc",
  },
  /**
   * Public deployment URL, used for canonical links and social previews.
   * Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://your-domain.com).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  hasRealDomain: !!process.env.NEXT_PUBLIC_SITE_URL,
};
