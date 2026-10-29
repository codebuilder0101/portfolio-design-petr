import { Clapperboard, Crop, History, Layers, Package, Sparkles, WandSparkles, type LucideIcon } from "lucide-react";

export const expertiseKeys = ["product", "retouch", "composite", "ai", "video", "motion", "restoration"] as const;
export type ExpertiseKey = (typeof expertiseKeys)[number];

export const expertiseIcons: Record<ExpertiseKey, LucideIcon> = {
  product: Package,
  retouch: Sparkles,
  composite: Layers,
  ai: WandSparkles,
  video: Clapperboard,
  motion: Crop,
  restoration: History,
};

/** Circle tint per capability — accents pulled from the artwork. */
export const expertiseTints: Record<ExpertiseKey, string> = {
  product: "bg-citrus text-ink",
  retouch: "bg-coral text-ink",
  composite: "bg-cobalt text-paper",
  ai: "bg-mint text-ink",
  video: "bg-ink text-citrus",
  motion: "bg-citrus text-ink",
  restoration: "bg-paper-3 text-ink",
};
