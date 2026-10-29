"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { RotateCcw, Search, X } from "lucide-react";
import { categoryIds, type CategoryId, type Project } from "@/data/projects";
import { useI18n } from "@/components/layout/I18nProvider";
import { format, plural } from "@/i18n/dictionaries";
import { ProjectCard } from "./ProjectCard";

type Filter = CategoryId | "all";

/** Repeating proportion pattern so the grid never reads as identical boxes. */
const ASPECTS = ["aspect-[4/5]", "aspect-[3/2]", "aspect-square", "aspect-[3/2]", "aspect-[4/5]", "aspect-square"];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function readUrl(): { category: Filter; q: string } {
  const params = new URLSearchParams(window.location.search);
  const c = params.get("category");
  return {
    category: c && (categoryIds as readonly string[]).includes(c) ? (c as CategoryId) : "all",
    q: params.get("q") ?? "",
  };
}

export function WorkExplorer({ projects, counts }: { projects: Project[]; counts: Record<CategoryId, number> }) {
  const { dict } = useI18n();
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  // Becomes true once the URL has been read, so the initial render never overwrites shared filters.
  const urlRead = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reflect state in the URL without adding history entries for every keystroke.
  // Declared before the URL-reading effect so it skips the very first pass.
  useEffect(() => {
    if (!urlRead.current) return;
    const params = new URLSearchParams(window.location.search);
    if (category === "all") params.delete("category");
    else params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [category, query]);

  // Initial state from the URL (shareable filters), and back/forward support.
  useEffect(() => {
    const sync = () => {
      const s = readUrl();
      setCategory(s.category);
      setQuery(s.q);
    };
    sync();
    urlRead.current = true;
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const searchIndex = useMemo(
    () =>
      new Map(
        projects.map((p) => [
          p.id,
          normalize(
            [
              p.title,
              p.content.specialty,
              p.content.summary,
              ...p.tags.map((t) => dict.tags[t]),
              ...p.categories.map((c) => dict.categories[c].label),
              ...p.stack,
            ].join(" "),
          ),
        ]),
      ),
    [projects, dict],
  );

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return projects.filter((p) => {
      if (category !== "all" && !p.categories.includes(category)) return false;
      const text = searchIndex.get(p.id) ?? "";
      return terms.every((t) => text.includes(t));
    });
  }, [projects, category, query, searchIndex]);

  const reset = () => {
    setCategory("all");
    setQuery("");
    inputRef.current?.focus();
  };

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: dict.work.all, count: projects.length },
    ...categoryIds.map((id) => ({ id, label: dict.categories[id].label, count: counts[id] })),
  ];

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 border-b border-line bg-paper/90 px-4 py-4 backdrop-blur-xl sm:-mx-7 sm:px-7 xl:-mx-12 xl:px-12">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div role="group" aria-label={dict.work.filtersLabel} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => {
              const active = category === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(f.id)}
                  className={`flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-base font-semibold whitespace-nowrap transition-colors sm:px-5 ${
                    active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {f.label}
                  <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${active ? "bg-citrus text-ink" : "bg-paper-2 text-ink-2"}`}>{f.count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full xl:max-w-sm">
            <label htmlFor="work-search" className="sr-only">
              {dict.work.searchLabel}
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-3" />
            <input
              ref={inputRef}
              id="work-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.work.searchPlaceholder}
              autoComplete="off"
              className="h-12 w-full rounded-full border-2 border-line bg-paper pr-12 pl-12 text-base font-medium placeholder:text-ink-3 focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cobalt [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label={dict.work.clearSearch}
                className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-paper-2"
              >
                <X aria-hidden className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 font-mono text-sm font-semibold text-ink-2">
        {plural(results.length, dict.work.result, dict.work.results)}
        {query.trim() && ` ${format(dict.work.resultsFor, { query: query.trim() })}`}
        {category !== "all" && ` · ${dict.categories[category].label}`}
      </p>

      {results.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-5 rounded-[var(--radius-frame)] border-2 border-dashed border-line p-8 sm:p-12">
          <h2 className="display-md">{dict.work.emptyTitle}</h2>
          <p className="max-w-xl text-lg text-ink-2">{dict.work.emptyText}</p>
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-cobalt">
            <RotateCcw aria-hidden className="size-5" />
            {dict.work.reset}
          </button>
        </div>
      ) : (
        <LayoutGroup>
          <motion.ul layout={!reduce} className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={i % 3 === 1 ? "lg:mt-16" : ""}
                >
                  <ProjectCard
                    project={p}
                    headingLevel="h2"
                    aspect={ASPECTS[p.id % ASPECTS.length]}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                    priority={i < 3}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      )}
    </div>
  );
}
