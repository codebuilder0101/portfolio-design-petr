import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { pt } from "./pt";
import { es } from "./es";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, pt, es };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Fills `{name}` placeholders. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/** Picks the singular or plural template based on count. */
export const plural = (count: number, one: string, many: string) => format(count === 1 ? one : many, { count });
