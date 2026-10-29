import type { Locale } from "@/i18n/config";
import type { ProjectContentMap } from "./types";
import { en } from "./en";
import { pt } from "./pt";
import { es } from "./es";

export type { ProjectContent } from "./types";

export const content: Record<Locale, ProjectContentMap> = { en, pt, es };
