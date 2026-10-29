export type ProjectContent = {
  /** Short specialty label, e.g. "Jewelry macro editing". */
  specialty: string;
  /** One-sentence card description. */
  summary: string;
  /** Full concept brief (2–3 sentences). */
  brief: string;
  /** Intended use: where this kind of visual would run. */
  use: string;
  /** Visual direction notes. */
  direction: string;
  /** Alt text for the still artwork. */
  alt: string;
  /** Captions for each detail crop, same order and length as `details` in projects.ts. */
  detailCaptions: string[];
};

export type ProjectContentMap = Record<number, ProjectContent>;
