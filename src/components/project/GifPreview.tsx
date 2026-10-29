"use client";

import { useState } from "react";
import { ImageOff, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { Picture } from "@/components/media/Picture";

/** GIF is only requested after an explicit click. */
export function GifPreview({ project }: { project: Project }) {
  const { dict } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const gif = project.media.gif;
  if (!gif) return null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-frame)] bg-paper-2 shadow-soft">
      {failed ? (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-2">
          <ImageOff aria-hidden className="size-8" strokeWidth={1.5} />
          <p className="font-medium">{dict.common.imageUnavailable}</p>
        </div>
      ) : loaded ? (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIF shown as-is
        <img
          src={gif.src}
          alt={`${project.title} — ${dict.project.gifLabel}`}
          width={gif.width}
          height={gif.height}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover [image-rendering:auto]"
        />
      ) : (
        <>
          {project.media.video && <Picture fill source={project.media.video.poster} alt="" sizes="(min-width: 1024px) 30vw, 100vw" color={project.media.color} imgClassName="opacity-80" />}
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper/40 backdrop-blur-[2px] transition hover:bg-paper/25"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-ink text-paper shadow-lift transition group-hover:scale-105">
              <Play aria-hidden className="ml-0.5 size-6 fill-current" />
            </span>
            <span className="rounded-full bg-paper px-4 py-2 font-semibold">{dict.project.loadGif}</span>
          </button>
        </>
      )}
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1.5 font-mono text-xs font-semibold">
        GIF · {gif.width} × {gif.height}
      </span>
    </div>
  );
}
