"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { Picture } from "@/components/media/Picture";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Reveal } from "@/components/ui/Reveal";
import { href } from "@/lib/paths";

/** One large player with a list of motion studies. Nothing loads until play is pressed. */
export function MotionShowcase({ projects }: { projects: Project[] }) {
  const { locale, dict } = useI18n();
  const [selected, setSelected] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const current = projects[selected];

  return (
    <section aria-labelledby="motion-title" className="container-x py-16 sm:py-24">
      <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="eyebrow">{dict.home.motionEyebrow}</p>
          <h2 id="motion-title" className="display-lg mt-4">
            {dict.home.motionTitle}
          </h2>
        </div>
        <p className="max-w-xl text-xl text-ink-2 lg:justify-self-end">{dict.home.motionIntro}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] lg:gap-8">
        <div>
          {current.media.video && (
            <VideoPlayer
              key={current.id}
              startOnMount={autoStart}
              video={current.media.video}
              title={current.title}
              alt={current.content.alt}
              color={current.media.color}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="rounded-[var(--radius-frame)] shadow-lift"
            />
          )}
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {current.title} <span className="font-sans text-lg font-medium text-ink-2">— {current.content.specialty}</span>
            </p>
            <Link href={href(locale, `work/${current.slug}`)} className="inline-flex min-h-11 items-center gap-1.5 text-lg font-semibold text-cobalt hover:underline">
              {dict.common.viewProject}
              <ArrowUpRight aria-hidden className="size-5" />
            </Link>
          </div>
        </div>

        <div role="group" aria-label={dict.home.motionList}>
          <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {projects.map((p, i) => {
              const active = i === selected;
              return (
                <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setAutoStart(true);
                      setSelected(i);
                    }}
                    className={`flex w-full items-center gap-4 rounded-2xl p-2 pr-4 text-left transition ${
                      active ? "bg-ink text-paper shadow-soft" : "bg-paper-2 hover:bg-paper-3"
                    }`}
                  >
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl sm:w-32">
                      {p.media.video && <Picture fill source={p.media.video.poster} alt="" sizes="128px" color={p.media.color} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg font-bold tracking-tight">{p.title}</span>
                      <span className={`block truncate text-sm ${active ? "text-paper/80" : "text-ink-2"}`}>{p.content.specialty}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
