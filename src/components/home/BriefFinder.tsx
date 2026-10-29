import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryIds, type CategoryId, type Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { plural, type Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  locale: Locale;
  dict: Dictionary;
  counts: Record<CategoryId, number>;
  picks: Record<CategoryId, Project[]>;
};

const accents: Record<CategoryId, string> = {
  product: "bg-citrus",
  portrait: "bg-coral",
  lifestyle: "bg-mint",
  sports: "bg-cobalt",
  compositing: "bg-coral",
  corporate: "bg-citrus",
};

/** Editorial index of categories — each row links to the filtered work page. */
export function BriefFinder({ locale, dict, counts, picks }: Props) {
  return (
    <section aria-labelledby="find-title" className="border-y border-line bg-paper-2/70 py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{dict.home.findEyebrow}</p>
          <h2 id="find-title" className="display-lg mt-4">
            {dict.home.findTitle}
          </h2>
          <p className="mt-5 text-xl text-ink-2">{dict.home.findIntro}</p>
        </Reveal>

        <ul className="mt-12 border-t-2 border-ink">
          {categoryIds.map((id, i) => (
            <li key={id} className="border-b border-line">
              <Link
                href={`${href(locale, "work")}?category=${id}`}
                className="group grid items-center gap-4 py-6 sm:py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,22rem)_3.5rem] md:gap-6 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,30rem)_3.5rem]"
              >
                <span className="hidden font-mono text-sm font-semibold text-ink-3 md:block">0{i + 1}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={`size-3 shrink-0 rounded-full ${accents[id]}`} />
                    <span className="font-display text-[1.75rem] leading-tight font-bold tracking-tight transition-colors group-hover:text-cobalt sm:text-4xl lg:text-5xl">
                      {dict.categories[id].label}
                    </span>
                  </span>
                  <span className="mt-2 block text-base text-ink-2 sm:text-lg">
                    {dict.categories[id].blurb} <span className="font-semibold whitespace-nowrap text-ink">· {plural(counts[id], dict.common.project, dict.common.projects)}</span>
                  </span>
                </span>
                <span aria-hidden className="flex h-24 gap-2 sm:h-28 lg:h-32">
                  {picks[id].map((p) => (
                    <span
                      key={p.id}
                      className="relative flex-1 overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out group-hover:first:flex-[1.8]"
                    >
                      <Picture fill source={p.media.image} alt="" sizes="(min-width: 1024px) 12vw, 33vw" focus={p.focus} color={p.media.color} />
                    </span>
                  ))}
                </span>
                <span
                  aria-hidden
                  className="hidden size-14 items-center justify-center rounded-full border-2 border-ink transition-colors group-hover:bg-ink group-hover:text-paper md:flex"
                >
                  <ArrowRight className="size-6 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
