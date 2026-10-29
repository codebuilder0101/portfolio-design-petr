import type { Metadata } from "next";
import { htmlLang, locales, ogLocale, type Locale } from "@/i18n/config";
import { site } from "@/config/site";
import { href } from "./paths";

type Input = {
  locale: Locale;
  title: string;
  description: string;
  /** Route path without locale, e.g. "work/night-shift". */
  path?: string;
  /** Overrides the default social image (absolute or root-relative). */
  image?: { url: string; width: number; height: number; alt: string };
};

/** Localized metadata with hreflang alternates and Open Graph / Twitter cards. */
export function pageMetadata({ locale, title, description, path = "", image }: Input): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [htmlLang[l], href(l, path)]));
  const ogImage = image ?? { url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: `${site.name} — ${title}` };
  return {
    title,
    description,
    alternates: { canonical: href(locale, path), languages: { ...languages, "x-default": href("en", path) } },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: href(locale, path),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

export const icons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
};
