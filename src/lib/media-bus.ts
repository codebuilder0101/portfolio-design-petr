// Ensures only one video/preview plays at a time across the whole page.
let active: HTMLMediaElement | null = null;
const listeners = new Set<() => void>();

/** Call when a media element starts playing; pauses whichever was playing before. */
export function claimPlayback(el: HTMLMediaElement) {
  if (active && active !== el && !active.paused) active.pause();
  active = el;
  listeners.forEach((fn) => fn());
}

export function releasePlayback(el: HTMLMediaElement) {
  if (active === el) active = null;
}

/** Pauses anything currently playing (e.g. when a dialog opens). */
export function pauseAll() {
  if (active && !active.paused) active.pause();
}

/** Notified when playback is claimed — lets hover GIF previews stop themselves. */
export function onClaim(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
