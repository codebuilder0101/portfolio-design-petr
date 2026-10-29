"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, VideoOff, X } from "lucide-react";
import type { ProjectMedia } from "@/data/projects";
import { claimPlayback, releasePlayback } from "@/lib/media-bus";
import { useI18n } from "@/components/layout/I18nProvider";
import { Picture } from "./Picture";

type Props = {
  video: NonNullable<ProjectMedia["video"]>;
  title: string;
  /** Alt text describing the poster frame. */
  alt: string;
  sizes: string;
  /** Start playing as soon as the player mounts (only after an explicit user action, e.g. in a dialog). */
  startOnMount?: boolean;
  /** Shows a close control that calls this (dialogs). Otherwise the close control returns to the poster. */
  onClose?: () => void;
  className?: string;
  color?: string;
};

type State = "idle" | "loading" | "playing" | "paused" | "error";

/**
 * Silent MP4 player: poster first (preload="none"), explicit play/pause/close controls,
 * pauses when scrolled off-screen and when another preview starts.
 */
export function VideoPlayer({ video, title, alt, sizes, startOnMount, onClose, className = "", color }: Props) {
  const { dict } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  const started = state !== "idle";

  const play = () => {
    const el = ref.current;
    if (!el) return;
    setState((s) => (s === "idle" ? "loading" : s));
    el.play().catch(() => {
      /* error state is handled by onError */
    });
  };

  const pause = () => ref.current?.pause();

  const stop = () => {
    const el = ref.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setProgress(0);
    if (onClose) onClose();
    else setState("idle");
  };

  useEffect(() => {
    if (startOnMount) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Pause when scrolled out of view.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && ref.current && !ref.current.paused) ref.current.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) releasePlayback(el);
    };
  }, []);

  const posterUrl = `${video.poster.base}-${video.poster.widths[video.poster.widths.length - 1]}.webp`;

  return (
    <div
      ref={wrapRef}
      className={`group/player relative isolate aspect-video w-full overflow-hidden bg-ink ${className}`}
      style={{ backgroundColor: color }}
    >
      {state === "error" ? (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper-2 text-ink-2">
          <VideoOff aria-hidden className="size-9" strokeWidth={1.5} />
          <p className="font-medium">{dict.common.videoUnavailable}</p>
        </div>
      ) : (
        <>
          <video
            ref={ref}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}
            preload="none"
            poster={posterUrl}
            muted
            playsInline
            loop
            width={video.width}
            height={video.height}
            aria-label={`${title} — ${dict.common.motionStudy}`}
            onPlay={(e) => {
              claimPlayback(e.currentTarget);
              setState("playing");
            }}
            onPause={(e) => {
              releasePlayback(e.currentTarget);
              setState((s) => (s === "idle" ? s : "paused"));
            }}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration) setProgress(el.currentTime / el.duration);
            }}
            onError={() => setState("error")}
            onClick={() => (ref.current?.paused ? play() : pause())}
          >
            <source src={video.src} type="video/mp4" onError={() => setState("error")} />
          </video>

          {!started && (
            <>
              <Picture fill source={video.poster} alt={alt} sizes={sizes} color={color} />
              <button
                type="button"
                onClick={play}
                className="absolute inset-0 z-10 flex items-center justify-center bg-ink/0 transition-colors hover:bg-ink/10"
                aria-label={`${dict.common.play}: ${title}`}
              >
                <span className="flex size-20 items-center justify-center rounded-full bg-paper text-ink shadow-lift transition-transform duration-300 group-hover/player:scale-105 sm:size-24">
                  <Play aria-hidden className="ml-1 size-8 fill-current sm:size-9" />
                </span>
              </button>
            </>
          )}

          <span className="pointer-events-none absolute top-3 left-3 z-20 rounded-full bg-paper/90 px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-ink backdrop-blur sm:top-4 sm:left-4">
            {dict.common.silent}
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-end gap-3 p-3 sm:p-4">
            {started && (
              <div className="pointer-events-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => (state === "playing" ? pause() : play())}
                  aria-label={state === "playing" ? dict.common.pause : dict.common.play}
                  className="flex size-12 items-center justify-center rounded-full bg-paper text-ink shadow-soft transition hover:bg-citrus"
                >
                  {state === "playing" || state === "loading" ? (
                    <Pause aria-hidden className="size-5 fill-current" />
                  ) : (
                    <Play aria-hidden className="ml-0.5 size-5 fill-current" />
                  )}
                </button>
                {!onClose && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = ref.current;
                      if (el) {
                        el.currentTime = 0;
                        play();
                      }
                    }}
                    aria-label={dict.common.replay}
                    className="flex size-12 items-center justify-center rounded-full bg-paper text-ink shadow-soft transition hover:bg-citrus"
                  >
                    <RotateCcw aria-hidden className="size-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={stop}
                  aria-label={dict.common.close}
                  className="flex size-12 items-center justify-center rounded-full bg-paper text-ink shadow-soft transition hover:bg-citrus"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
            )}
          </div>

          {started && (
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-1 bg-paper/30">
              <div className="h-full bg-citrus" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
