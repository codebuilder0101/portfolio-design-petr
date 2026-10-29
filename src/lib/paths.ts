import type { Locale } from "@/i18n/config";

/** Builds a localized internal href, always with a trailing slash (matches `trailingSlash: true`). */
export function href(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}
