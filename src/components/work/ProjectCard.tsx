"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { MotionPreviewButton } from "@/components/media/MotionDialog";
import { Picture } from "@/components/media/Picture";
import { format } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { onClaim } from "@/lib/media-bus";

// Only one hover preview at a time.
let stopActiveGif: (() => void) | null = null;

type Props = {
  project: Project;
  /** Tailwind aspect class for the image frame. */
  aspect?: string;
  sizes: string;
  /** Larger title for hero-sized cards. */
  size?: "md" | "lg";
  /** Adds crop-mark corners and an outlined frame. */
  outlined?: boolean;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function ProjectCard({ project, aspect = "aspect-[3/2]", sizes, size = "md", outlined, priority, headingLevel = "h3", className = "" }: Props) {
  const { locale, dict } = useI18n();
  const reduce = useReducedMotion();
  const [gifOn, setGifOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const Heading = headingLevel;
  const gif = project.media.gif;

  useEffect(() => onClaim(() => setGifOn(false)), []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const startGif = (e: React.PointerEvent) => {
    if (!gif || reduce || e.pointerType !== "mouse") return;
    timer.current = window.setTimeout(() => {
      if (stopActiveGif) stopActiveGif();
      stopActiveGif = () => setGifOn(false);
      setGifOn(true);
    }, 280);
  };
  const stopGif = () => {
    window.clearTimeout(timer.current);
    setGifOn(false);
  };

  return (
    <article
      className={`group relative flex flex-col ${className}`}
      onPointerEnter={startGif}
      onPointerLeave={stopGif}
    >
      <div
        className={`relative ${aspect} ${
          outlined ? "crop-marks rounded-none bg-paper ring-2 ring-ink" : "overflow-hidden rounded-[var(--radius-frame)]"
        } shadow-soft transition-[box-shadow,transform] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-lift`}
        style={{ backgroundColor: outlined ? undefined : project.media.color }}
      >
        <div className={`absolute overflow-hidden ${outlined ? "inset-3 sm:inset-4" : "inset-0"}`}>
          <Picture
            fill
            source={project.media.image}
            alt={project.content.alt}
            sizes={sizes}
            focus={project.focus}
            color={project.media.color}
            priority={priority}
            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>

        {gifOn && gif && (
          <span className="pointer-events-none absolute right-4 bottom-4 z-10 w-[min(46%,240px)] overflow-hidden rounded-xl border-2 border-paper shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element -- GIF is loaded only on hover */}
            <img src={gif.src} alt="" width={gif.width} height={gif.height} className="block h-auto w-full" />
          </span>
        )}

        <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-paper/90 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-ink backdrop-blur">
          {dict.common.concept} · {project.number}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Heading className={`font-display font-bold tracking-tight ${size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]"} leading-tight`}>
            <Link
              href={href(locale, `work/${project.slug}`)}
              className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[var(--radius-frame)] focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-cobalt"
              aria-label={format(dict.work.openCase, { title: project.title })}
            >
              {project.title}
            </Link>
          </Heading>
          <p className="mt-1 text-base text-ink-2 sm:text-lg">{project.content.specialty}</p>
        </div>
        <div className="relative z-10 flex shrink-0 gap-2">
          {project.media.video && (
            <MotionPreviewButton
              project={project}
              label={format(dict.work.previewLabel, { title: project.title })}
              className="flex size-12 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition hover:bg-citrus"
            >
              <Play aria-hidden className="ml-0.5 size-5 fill-current" />
            </MotionPreviewButton>
          )}
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-45"
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </article>
  );
}
