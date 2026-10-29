"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { href } from "@/lib/paths";
import { useI18n } from "./I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HireLink } from "./HireLink";
import { Logo } from "./Logo";

const NAV = ["work", "expertise", "process", "about"] as const;

export function Header() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (key: (typeof NAV)[number]) => pathname.startsWith(`/${locale}/${key}`);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-paper/80 shadow-[0_1px_0_rgb(27_28_32/0.06),0_10px_30px_-18px_rgb(27_28_32/0.35)] backdrop-blur-xl backdrop-saturate-150" : "bg-paper/0"
      }`}
    >
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-paper focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        {dict.nav.skip}
      </a>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href={href(locale)} aria-label={dict.nav.homeLink} className="rounded-2xl">
          <Logo />
        </Link>

        <nav aria-label={dict.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV.map((key) => {
              const active = isActive(key);
              return (
                <li key={key}>
                  <Link
                    href={href(locale, key)}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-12 items-center rounded-full px-4 text-lg font-semibold tracking-tight transition-colors xl:px-5 xl:text-xl ${
                      active ? "bg-ink text-paper" : "text-ink hover:bg-paper-2"
                    }`}
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <HireLink
            newTab={dict.hire.newTab}
            className="hidden h-12 items-center gap-1.5 rounded-full bg-citrus px-5 text-lg font-semibold tracking-tight text-ink transition-colors hover:bg-ink hover:text-paper sm:inline-flex lg:hidden xl:inline-flex"
          >
            {dict.hire.short}
          </HireLink>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label={dict.nav.openMenu}
            className="flex size-12 items-center justify-center rounded-full bg-ink text-paper shadow-soft transition hover:bg-cobalt lg:hidden"
          >
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} isActive={isActive} />}
    </header>
  );
}

function MobileMenu({ onClose, isActive }: { onClose: () => void; isActive: (key: (typeof NAV)[number]) => boolean }) {
  const { locale, dict } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const close = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) onClose();
    };
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("resize", close);
      root.style.overflow = "";
      if (dialog.open) dialog.close();
      opener?.focus({ preventScroll: true });
    };
  }, [onClose]);

  const links = [{ key: "home" as const, path: "" }, ...NAV.map((key) => ({ key, path: key }))];

  return (
    <dialog
      ref={ref}
      aria-label={dict.nav.primary}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-transparent"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-dvh flex-col bg-paper"
      >
        <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
          <Link href={href(locale)} aria-label={dict.nav.homeLink} onClick={onClose} className="rounded-2xl">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.nav.closeMenu}
            data-autofocus
            className="flex size-12 items-center justify-center rounded-full bg-ink text-paper shadow-soft transition hover:bg-cobalt"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>
        <nav aria-label={dict.nav.primary} className="container-x flex flex-1 flex-col justify-between gap-10 pt-6 pb-10">
          <ul className="flex flex-col">
            {links.map(({ key, path }, i) => {
              const active = key === "home" ? false : isActive(key);
              return (
                <motion.li
                  key={key}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <Link
                    href={href(locale, path)}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex min-h-16 items-center justify-between py-3 font-display text-4xl font-bold tracking-tight sm:text-5xl"
                  >
                    <span className={active ? "text-cobalt" : ""}>{dict.nav[key]}</span>
                    <ArrowUpRight aria-hidden className="size-8 text-ink-3 transition group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          <HireLink
            newTab={dict.hire.newTab}
            onClick={onClose}
            className="flex min-h-16 items-center justify-between gap-4 rounded-3xl bg-citrus px-6 py-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            {dict.hire.cta}
          </HireLink>
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{dict.nav.language}</p>
            <div className="self-start">
              <LanguageSwitcher size="lg" onSwitch={onClose} />
            </div>
          </div>
        </nav>
      </motion.div>
    </dialog>
  );
}
