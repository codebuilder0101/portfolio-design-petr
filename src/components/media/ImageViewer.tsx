"use client";

import { useState } from "react";
import { ExternalLink, ImageOff, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { Dialog } from "@/components/ui/Dialog";
import { format } from "@/i18n/dictionaries";

type TriggerProps = {
  project: Project;
  className?: string;
  label?: string;
  children: React.ReactNode;
};

/** Wraps any content in a button that opens the full-resolution original. */
export function ImageViewerTrigger({ project, className, label, children }: TriggerProps) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={label ?? `${dict.common.viewFullSize}: ${project.title}`}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open && <ImageViewer project={project} onClose={() => setOpen(false)} />}
    </>
  );
}

const control =
  "flex size-12 items-center justify-center rounded-full bg-paper text-ink shadow-soft transition hover:bg-citrus";

export function ImageViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { dict } = useI18n();
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  const { full, image } = project.media;

  return (
    <Dialog onClose={onClose} label={format(dict.project.viewerTitle, { title: project.title })} className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-ink/60 px-3 py-3 text-paper backdrop-blur sm:px-6">
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-bold sm:text-2xl">{project.title}</h2>
          <p className="truncate font-mono text-xs text-paper/80 sm:text-sm">
            {image.width} × {image.height} · {dict.common.conceptProject}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={`${control} hidden sm:flex`}
            onClick={() => setZoomed((z) => !z)}
            aria-pressed={zoomed}
            aria-label={zoomed ? dict.project.zoomOut : dict.project.zoomIn}
          >
            {zoomed ? <ZoomOut aria-hidden className="size-5" /> : <ZoomIn aria-hidden className="size-5" />}
          </button>
          <a href={full} target="_blank" rel="noopener" className={control} aria-label={dict.project.openOriginal}>
            <ExternalLink aria-hidden className="size-5" />
          </a>
          <button type="button" className={control} onClick={onClose} aria-label={dict.common.close} data-autofocus>
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <div
        className={`flex flex-1 p-3 sm:p-6 ${zoomed ? "items-start justify-start overflow-auto" : "items-center justify-center"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {failed ? (
          <div className="flex flex-col items-center gap-2 text-paper">
            <ImageOff aria-hidden className="size-10" strokeWidth={1.5} />
            <p>{dict.common.imageUnavailable}</p>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- original file shown at native resolution
          <img
            src={full}
            alt={project.content.alt}
            width={image.width}
            height={image.height}
            onError={() => setFailed(true)}
            onClick={() => setZoomed((z) => !z)}
            className={
              zoomed
                ? "m-auto max-w-none cursor-zoom-out rounded-lg"
                : "max-h-[calc(100dvh-7.5rem)] w-auto max-w-full cursor-zoom-in rounded-lg object-contain shadow-lift"
            }
          />
        )}
      </div>
    </Dialog>
  );
}
