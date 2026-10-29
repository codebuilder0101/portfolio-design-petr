import Link from "next/link";
import { ArrowUp } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { site } from "@/config/site";
import { HireLink } from "./HireLink";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    ["work", dict.nav.work],
    ["expertise", dict.nav.expertise],
    ["process", dict.nav.process],
    ["about", dict.nav.about],
  ] as const;
  return (
    <footer className="mt-24 border-t border-line bg-paper-2/60 sm:mt-32">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
        <div className="max-w-md">
          <Logo />
          <p className="mt-5 text-lg text-ink-2">{dict.footer.tagline}</p>
          <p className="mt-2 text-sm text-ink-3">{dict.meta.role}</p>
          <HireLink
            newTab={dict.hire.newTab}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-lg font-semibold tracking-tight text-paper transition-colors hover:bg-cobalt"
          >
            {dict.hire.cta}
          </HireLink>
        </div>
        <nav aria-label={dict.footer.explore}>
          <p className="eyebrow mb-3">{dict.footer.explore}</p>
          <ul className="grid grid-cols-2 gap-x-6">
            {links.map(([path, label]) => (
              <li key={path}>
                <Link href={href(locale, path)} className="inline-flex min-h-11 items-center text-lg font-semibold hover:text-cobalt">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#top"
          className="inline-flex size-14 items-center justify-center rounded-full border-2 border-ink transition hover:bg-ink hover:text-paper"
          aria-label={dict.footer.top}
        >
          <ArrowUp aria-hidden className="size-6" />
        </a>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-3 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>{dict.footer.rights}</p>
      </div>
    </footer>
  );
}
