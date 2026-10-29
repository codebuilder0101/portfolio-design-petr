"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { MotionPreviewButton } from "@/components/media/MotionDialog";
import { Picture } from "@/components/media/Picture";
import { portraits } from "@/data/portraits";
import { ButtonIcon, buttonClass } from "@/components/ui/Button";
import { format } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";

const INTERVAL = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ projects }: { projects: Project[] }) {
  const { locale, dict } = useI18n();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const running = !userPaused && !hovering && !reduce;
  const current = projects[index];

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % projects.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, index, projects.length]);

  const words = dict.home.headline.split(" ");

  return (
    <section aria-labelledby="hero-title" className="container-x">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-6 pb-16 lg:min-h-[min(calc(100svh-var(--header-h)-4px),800px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6.2fr)] lg:gap-14 lg:pt-2 lg:pb-10 xl:gap-20">
        {/* Copy */}
        <div className="flex flex-col items-start">
          <motion.div
            className="flex items-center gap-3.5"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-citrus ring-2 ring-citrus ring-offset-2 ring-offset-paper sm:size-16">
              <Picture fill priority source={portraits.avatar.image} alt="" sizes="64px" color={portraits.avatar.color} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{dict.home.greeting}</span>
              <span className="eyebrow flex items-center gap-2">
                <span aria-hidden className="inline-block size-2 rounded-full bg-coral" />
                {dict.home.eyebrow}
              </span>
            </span>
          </motion.div>
          <h1 id="hero-title" className="display-xl mt-6">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block pr-[0.22em] last:pr-0"
                initial={reduce ? false : { opacity: 0, y: "0.45em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease }}
              >
                {i === words.length - 1 ? (
                  <span className="relative whitespace-nowrap">
                    <span aria-hidden className="absolute inset-x-[-0.06em] bottom-[0.08em] -z-10 h-[0.32em] rounded-sm bg-citrus" />
                    {word}
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-xl leading-relaxed text-ink-2 sm:text-[1.375rem]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            {dict.home.intro}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
          >
            <Link href={href(locale, "work")} className={buttonClass("solid")}>
              {dict.common.exploreWork}
              <ButtonIcon icon={ArrowRight} />
            </Link>
            <MotionPreviewButton project={current} className={buttonClass("outline")}>
              <span aria-hidden className="-ml-3 flex size-9 items-center justify-center rounded-full bg-coral text-ink">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
              {dict.common.watchMotion}
            </MotionPreviewButton>
          </motion.div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label={dict.nav.expertise}>
            {dict.home.specialties.map((s, i) => (
              <li
                key={s}
                className={`rounded-full border px-4 py-2 text-[0.9375rem] font-semibold ${
                  ["border-cobalt/30 bg-cobalt/8 text-cobalt-deep", "border-ink/15 bg-coral/15", "border-ink/15 bg-citrus/40", "border-ink/15 bg-mint/45"][i % 4]
                }`}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Showcase */}
        <div
          className="relative"
          role="group"
          aria-roledescription="carousel"
          aria-label={dict.home.showcaseLabel}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          <motion.div
            initial={reduce ? false : { clipPath: "inset(8% 8% 8% 8% round 40px)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-frame)] shadow-lift lg:aspect-auto lg:h-[min(calc(100svh-var(--header-h)-7rem),660px)]"
            style={{ backgroundColor: current.media.color }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1, ease }}
              >
                <Link href={href(locale, `work/${current.slug}`)} className="absolute inset-0 block" aria-label={`${dict.common.viewProject}: ${current.title}`}>
                  <Picture
                    fill
                    priority={index === 0}
                    source={current.media.image}
                    alt={current.content.alt}
                    focus={current.focus}
                    color={current.media.color}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <div className="pointer-events-none absolute top-4 right-4 left-4 flex items-start justify-end gap-3">
              <span className="rounded-full bg-paper/90 px-3 py-1.5 font-mono text-xs font-semibold tracking-wide backdrop-blur">
                {dict.common.conceptProject}
              </span>
            </div>
          </motion.div>

          {/* Supporting: title card with controls */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="relative z-10 mx-2 -mt-8 flex items-center gap-3 rounded-3xl bg-paper/95 p-3 pl-5 sm:mr-8 sm:-mt-14 sm:ml-auto sm:w-[min(100%,28rem)] shadow-lift ring-1 ring-ink/5 backdrop-blur"
          >
            <div className="min-w-0 flex-1" aria-live={running ? "off" : "polite"}>
              <p className="font-mono text-xs font-semibold text-ink-3">
                {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </p>
              <Link href={href(locale, `work/${current.slug}`)} className="group/t flex min-h-11 items-center gap-1.5 font-display text-xl font-bold tracking-tight hover:text-cobalt">
                <span className="truncate">{current.title}</span>
                <ArrowUpRight aria-hidden className="size-5 shrink-0 transition group-hover/t:translate-x-0.5" />
              </Link>
              <p className="truncate text-sm text-ink-2">{current.content.specialty}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={format(dict.home.showSlide, { title: p.title })}
                  aria-current={i === index ? "true" : undefined}
                  className="group/dot hidden size-8 items-center justify-center rounded-full sm:flex"
                >
                  <span className={`block h-2.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-ink" : "w-2.5 bg-ink/25 group-hover/dot:bg-ink/50"}`} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                aria-label={userPaused || reduce ? dict.home.playRotation : dict.home.pauseRotation}
                className="ml-1 flex size-12 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-cobalt"
              >
                {userPaused || reduce ? <Play aria-hidden className="ml-0.5 size-5 fill-current" /> : <Pause aria-hidden className="size-5 fill-current" />}
              </button>
            </div>
          </motion.div>

          {/* Supporting: portrait of Petr */}
          <motion.figure
            initial={reduce ? false : { opacity: 0, x: -16, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="absolute top-10 -left-5 z-10 hidden w-[31%] max-w-[15rem] lg:block xl:-left-12"
          >
            <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.375rem] border-[5px] border-paper bg-citrus shadow-lift">
              <Picture fill priority source={portraits.hero.image} alt={dict.home.portraitAlt} sizes="240px" focus={{ x: 50, y: 30 }} color={portraits.hero.color} />
            </span>
            <figcaption className="absolute -right-4 -bottom-4 rounded-full bg-ink px-4 py-2 font-display text-base font-bold tracking-tight whitespace-nowrap text-paper shadow-soft">
              Petr Smital
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
