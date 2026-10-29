"use client";

import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import type { Point, ResponsiveSource } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";

type Props = {
  source: ResponsiveSource;
  alt: string;
  /** Standard `sizes` attribute — keep it accurate so the right width is fetched. */
  sizes: string;
  priority?: boolean;
  /** Fill the positioned parent and crop with object-fit: cover. */
  fill?: boolean;
  focus?: Point;
  /** Zoom factor for detail crops (1 = none). */
  zoom?: number;
  color?: string;
  className?: string;
  imgClassName?: string;
};

const srcSet = (s: ResponsiveSource, ext: "avif" | "webp") => s.widths.map((w) => `${s.base}-${w}.${ext} ${w}w`).join(", ");

/** Responsive AVIF/WebP picture with explicit dimensions and a graceful missing-asset state. */
export function Picture({ source, alt, sizes, priority, fill, focus, zoom = 1, color, className = "", imgClassName = "" }: Props) {
  const { dict } = useI18n();
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image can fail before hydration attaches onError; detect that case too.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const fallbackWidth = source.widths.find((w) => w >= 1080) ?? source.widths[source.widths.length - 1];
  const position = focus ? `${focus.x}% ${focus.y}%` : undefined;
  const wrapper = fill ? `absolute inset-0 block overflow-hidden ${className}` : `block overflow-hidden ${className}`;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${fill ? "absolute inset-0" : "aspect-[3/2] w-full"} flex flex-col items-center justify-center gap-2 bg-paper-2 text-ink-3 ${className}`}
      >
        <ImageOff aria-hidden className="size-8" strokeWidth={1.5} />
        <span className="text-sm font-medium">{dict.common.imageUnavailable}</span>
      </div>
    );
  }

  return (
    <picture className={wrapper} style={{ backgroundColor: color }}>
      <source type="image/avif" srcSet={srcSet(source, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(source, "webp")} sizes={sizes} />
      <img
        ref={imgRef}
        src={`${source.base}-${fallbackWidth}.webp`}
        alt={alt}
        width={source.width}
        height={source.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`${fill ? "h-full w-full object-cover" : "h-auto w-full"} ${imgClassName}`}
        style={{
          objectPosition: position,
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: zoom !== 1 ? position : undefined,
        }}
      />
    </picture>
  );
}
