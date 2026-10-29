import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";
import { htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LogoMark } from "@/components/layout/Logo";
import { site } from "@/config/site";

export const metadata: Metadata = { title: `404 · ${site.name}`, robots: { index: false } };

/** Trilingual 404 — unmatched URLs have no locale to pick from. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <main className="container-x flex min-h-dvh flex-col justify-center gap-12 py-16">
          <Link href="/" aria-label={site.name} className="self-start rounded-2xl">
            <LogoMark className="size-14" />
          </Link>
          <h1 className="display-xl text-cobalt">
            404
          </h1>
          <div className="grid gap-10 md:grid-cols-3">
            {locales.map((l) => {
              const d = getDictionary(l).notFound;
              return (
                <section key={l} lang={htmlLang[l]}>
                  <h2 className="display-md">{d.title}</h2>
                  <p className="mt-3 text-lg text-ink-2">{d.text}</p>
                  <a href={`/${l}/work/`} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper hover:bg-cobalt">
                    {d.back}
                  </a>
                </section>
              );
            })}
          </div>
        </main>
      </body>
    </html>
  );
}
