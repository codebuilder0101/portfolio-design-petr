"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY, selectorOrder, switchLocalePath, type Locale } from "@/i18n/config";
import { useI18n } from "./I18nProvider";

export function saveLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* storage unavailable (private mode) — the URL still carries the language */
  }
}

/** Segmented PT | ES | EN selector. Keeps the current page, filters and hash. */
export function LanguageSwitcher({ size = "md", onSwitch }: { size?: "md" | "lg"; onSwitch?: () => void }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || `/${locale}/`;
  const router = useRouter();

  const item = size === "lg" ? "min-w-16 h-14 text-lg" : "min-w-12 h-11 text-[0.9375rem]";

  return (
    <div role="group" aria-label={dict.nav.language} className="flex rounded-full border border-line bg-paper/70 p-1">
      {selectorOrder.map((code) => {
        const active = code === locale;
        const target = switchLocalePath(pathname, code);
        return (
          <a
            key={code}
            href={target}
            hrefLang={code === "pt" ? "pt-BR" : code}
            lang={code === "pt" ? "pt-BR" : code}
            aria-current={active ? "true" : undefined}
            aria-label={dict.nav.languageNames[code]}
            onClick={(e) => {
              e.preventDefault();
              saveLocale(code);
              onSwitch?.();
              if (active) return;
              router.push(target + window.location.search + window.location.hash, { scroll: false });
            }}
            className={`flex items-center justify-center rounded-full px-3 font-mono font-semibold tracking-wide transition-colors ${item} ${
              active ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
            }`}
          >
            {code.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
