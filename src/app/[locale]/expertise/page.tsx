import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, plural } from "@/i18n/dictionaries";
import { getProjects, toolUsage, type CategoryId, type Project, type TagId } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { expertiseIcons, expertiseKeys, expertiseTints, type ExpertiseKey } from "@/components/ui/icons";
import { Closing } from "@/components/home/ExpertiseAndProcess";

export async function generateMetadata({ params }: PageProps<"/[locale]/expertise">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, title: dict.meta.expertise.title, description: dict.meta.expertise.description, path: "expertise" });
}

/** How each capability maps onto the dataset: tools, example projects and where "see examples" points. */
const GROUPS: Record<ExpertiseKey, { tools: string[]; examples: number[]; link: { category?: CategoryId; q?: string } }> = {
  product: { tools: ["Photoshop", "Lightroom", "Capture One", "Blender"], examples: [42, 36, 34], link: { category: "product" } },
  retouch: { tools: ["Photoshop", "Lightroom", "Capture One"], examples: [56, 32, 47], link: { category: "portrait" } },
  composite: { tools: ["Photoshop", "After Effects", "Mocha", "Blender", "Illustrator"], examples: [59, 58, 60], link: { category: "compositing" } },
  ai: { tools: ["Photoshop", "Lightroom", "Illustrator"], examples: [55, 52, 31], link: {} },
  video: { tools: ["Premiere Pro", "DaVinci Resolve"], examples: [39, 38, 51], link: { category: "sports" } },
  motion: { tools: ["After Effects", "Premiere Pro", "Dragonframe"], examples: [40, 49, 48], link: { category: "lifestyle" } },
  restoration: { tools: ["Photoshop", "Lightroom"], examples: [43], link: { q: "restoration" satisfies TagId } },
};

export default async function ExpertisePage({ params }: PageProps<"/[locale]/expertise">) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const all = getProjects(locale);
  const byId = new Map<number, Project>(all.map((p) => [p.id, p]));
  const tools = toolUsage();

  const examplesHref = (link: { category?: CategoryId; q?: string }) => {
    const qs = new URLSearchParams();
    if (link.category) qs.set("category", link.category);
    if (link.q) qs.set("q", dict.tags[link.q as TagId] ?? link.q);
    const s = qs.toString();
    return `${href(locale, "work")}${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <header className="container-x pt-8 sm:pt-12">
        <p className="eyebrow">{dict.expertise.eyebrow}</p>
        <h1 className="display-xl mt-4 max-w-5xl">{dict.expertise.title}</h1>
        <p className="mt-6 max-w-3xl text-xl text-ink-2">{dict.expertise.intro}</p>
      </header>

      <ul className="container-x mt-14 flex flex-col sm:mt-20">
        {expertiseKeys.map((key, i) => {
          const Icon = expertiseIcons[key];
          const group = dict.expertise.groups[key];
          const meta = GROUPS[key];
          return (
            <Reveal as="li" key={key} className="grid gap-8 border-t-2 border-ink py-10 sm:py-14 lg:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
              <span className={`flex size-24 items-center justify-center rounded-full shadow-soft sm:size-28 ${expertiseTints[key]}`}>
                <Icon aria-hidden className="size-11 sm:size-12" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-mono text-sm font-semibold text-ink-3">0{i + 1}</p>
                <h2 className="display-md mt-2">{group.title}</h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl">{group.text}</p>
                <h3 className="eyebrow mt-6">{dict.expertise.toolsLabel}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {meta.tools.map((t) => (
                    <li key={t} className="rounded-full bg-paper-2 px-4 py-2 font-semibold">
                      {t}
                    </li>
                  ))}
                </ul>
                <Link href={examplesHref(meta.link)} className="mt-6 inline-flex min-h-11 items-center gap-2 text-lg font-semibold text-cobalt hover:underline">
                  {dict.expertise.examples}
                  <ArrowRight aria-hidden className="size-5" />
                </Link>
              </div>
              <ul className="grid grid-cols-3 gap-3 self-start">
                {meta.examples.map((id) => {
                  const p = byId.get(id);
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <Link href={href(locale, `work/${p.slug}`)} className="group block">
                        <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                          <Picture fill source={p.media.image} alt="" sizes="(min-width: 1024px) 12vw, 30vw" focus={p.focus} color={p.media.color} imgClassName="transition-transform duration-700 group-hover:scale-105" />
                        </span>
                        <span className="mt-2 block truncate text-sm font-semibold group-hover:text-cobalt">{p.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          );
        })}
      </ul>

      <section aria-labelledby="tools-title" className="mt-10 border-y border-line bg-paper-2/70 py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <Reveal>
            <h2 id="tools-title" className="display-lg">
              {dict.expertise.toolsTitle}
            </h2>
            <p className="mt-4 text-xl text-ink-2">{dict.expertise.toolsIntro}</p>
          </Reveal>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {tools.map(({ tool, count }) => (
              <li key={tool} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                <span className="font-display text-2xl font-bold tracking-tight">{tool}</span>
                <span className="font-mono text-sm font-semibold whitespace-nowrap text-ink-2">{plural(count, dict.expertise.brief, dict.expertise.briefs)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="container-x py-16 sm:py-24">
        <h2 id="principles-title" className="display-lg">
          {dict.expertise.principlesTitle}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.expertise.principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="rounded-[var(--radius-frame)] bg-paper p-6 shadow-soft ring-1 ring-ink/5">
              <span aria-hidden className={`block h-2 w-12 rounded-full ${["bg-cobalt", "bg-coral", "bg-citrus", "bg-mint"][i]}`} />
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-2">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <Closing locale={locale} dict={dict} title={dict.home.closingTitle} text={dict.home.closingText} />
    </>
  );
}
