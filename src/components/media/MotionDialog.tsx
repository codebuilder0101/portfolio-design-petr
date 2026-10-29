"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { Dialog } from "@/components/ui/Dialog";
import { VideoPlayer } from "./VideoPlayer";

type TriggerProps = {
  project: Project;
  className?: string;
  children: React.ReactNode;
  /** Overrides the default accessible label. */
  label?: string;
};

/** A button that opens the project's MP4 motion study in a modal player. */
export function MotionPreviewButton({ project, className, children, label }: TriggerProps) {
  // Snapshot the project on open so a rotating parent can't swap it mid-playback.
  const [opened, setOpened] = useState<Project | null>(null);
  if (!project.media.video) return null;
  return (
    <>
      <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={() => setOpened(project)}>
        {children}
      </button>
      {opened && <MotionDialog project={opened} onClose={() => setOpened(null)} />}
    </>
  );
}

export function MotionDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { dict } = useI18n();
  const video = project.media.video;
  if (!video) return null;
  return (
    <Dialog onClose={onClose} label={`${project.title} — ${dict.common.motionStudy}`} className="flex min-h-dvh items-center justify-center p-3 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-paper">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</h2>
          <p className="font-mono text-sm text-paper/80">
            {project.content.specialty} · {dict.common.conceptProject}
          </p>
        </div>
        <VideoPlayer
          startOnMount
          onClose={onClose}
          video={video}
          title={project.title}
          alt={project.content.alt}
          color={project.media.color}
          sizes="(min-width: 1200px) 1152px, 100vw"
          className="rounded-2xl shadow-lift sm:rounded-3xl"
        />
        <p className="mt-3 max-w-3xl text-sm text-paper/85">{dict.disclosure.short}</p>
      </div>
    </Dialog>
  );
}
