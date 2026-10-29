export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Order shown in the PT | ES | EN selector. */
export const selectorOrder: Locale[] = ["pt", "es", "en"];

/** Value written to <html lang> and Open Graph locale. */
export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-BR", es: "es" };
export const ogLocale: Record<Locale, string> = { en: "en_US", pt: "pt_BR", es: "es_ES" };

export const LOCALE_STORAGE_KEY = "frame-motion-locale";

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

/** Maps a browser language list (navigator.languages) to a supported locale. */
export function matchBrowserLocale(languages: readonly string[]): Locale | null {
  for (const lang of languages) {
    const base = lang.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

/** Replaces the locale prefix of a pathname, preserving the rest of the route. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}
