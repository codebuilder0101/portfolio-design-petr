import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Maximize2 } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { format, getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getNeighbours, getProject, getRelated, projectSlugs, type Project } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { site } from "@/config/site";
import { ImageViewerTrigger } from "@/components/media/ImageViewer";
import { Picture } from "@/components/media/Picture";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { GifPreview } from "@/components/project/GifPreview";
import { Disclosure } from "@/components/project/Disclosure";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(locale, slug);
  if (!project) return {};
  const dict = getDictionary(locale);
  const image = project.media.video
    ? { url: project.media.video.posterJpg, width: project.media.video.width, height: project.media.video.height, alt: project.content.alt }
    : undefined;
  return pageMetadata({
    locale,
    title: `${project.title} — ${project.content.specialty}`,
    description: format(dict.meta.projectDescription, { specialty: project.content.specialty, summary: project.content.summary }),
    path: `work/${slug}`,
    image,
  });
}

const accentBg: Record<Project["accent"], string> = {
  cobalt: "bg-cobalt text-paper",
  citrus: "bg-citrus text-ink",
  coral: "bg-coral text-ink",
  mint: "bg-mint text-ink",
};

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const project = getProject(locale, slug);
  if (!project) notFound();
  const dict = getDictionary(locale);
  const { prev, next } = getNeighbours(locale, slug);
  const related = getRelated(locale, slug, 3);
  const motionFirst = project.variant === "motion" || project.variant === "sports";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    about: project.content.specialty,
    description: project.content.brief,
    inLanguage: locale === "pt" ? "pt-BR" : locale,
    image: `${site.url}${project.media.full}`,
    creativeWorkStatus: "Concept",
    author: { "@type": "Person", name: site.name, sameAs: [site.hire.url] },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Title */}
      <header className="container-x pt-6 sm:pt-10">
        <nav aria-label={dict.project.back} className="flex flex-wrap items-center justify-between gap-3">
          <Link href={href(locale, "work")} className="group inline-flex min-h-12 items-center gap-2 rounded-full pr-3 text-lg font-semibold hover:text-cobalt">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-ink transition group-hover:-translate-x-0.5">
              <ArrowLeft aria-hidden className="size-5" />
            </span>
            {dict.project.back}
          </Link>
          <span className="font-mono text-sm font-semibold text-ink-3">{format(dict.common.projectNumber, { number: project.number })}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-4 py-1.5 font-mono text-sm font-semibold tracking-wide uppercase ${accentBg[project.accent]}`}>
                {dict.common.conceptProject}
              </span>
              <span className="text-lg font-semibold text-ink-2">{project.content.specialty}</span>
            </div>
            <h1 className="display-xl mt-5">{project.title}</h1>
          </div>
          <div>
            <p className="text-xl leading-relaxed text-ink-2 sm:text-[1.375rem]">{project.content.summary}</p>
            <ul aria-label={dict.project.categories} className="mt-5 flex flex-wrap gap-2">
              {project.categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`${href(locale, "work")}?category=${c}`}
                    className="inline-flex min-h-11 items-center rounded-full border-2 border-line px-4 font-semibold transition hover:border-ink"
                  >
                    {dict.categories[c].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Hero artwork */}
      <div className="container-x mt-10 sm:mt-14">
        <ImageReveal>
          <ImageViewerTrigger project={project} className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-frame)] shadow-lift">
            <Picture
              priority
              source={project.media.image}
              alt={project.content.alt}
              sizes="(min-width: 1680px) 1584px, 100vw"
              color={project.media.color}
              imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.015]"
            />
            <span className="absolute right-4 bottom-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-paper/95 px-5 font-semibold shadow-soft backdrop-blur transition group-hover:bg-citrus">
              <Maximize2 aria-hidden className="size-5" />
              {dict.common.viewFullSize}
            </span>
          </ImageViewerTrigger>
        </ImageReveal>
      </div>

      {/* Brief + facts */}
      <section aria-labelledby="brief-title" className="container-x mt-16 grid gap-12 sm:mt-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <h2 id="brief-title" className="eyebrow">
            {dict.project.brief}
          </h2>
          <p className="mt-5 font-display text-2xl leading-[1.25] font-semibold tracking-tight sm:text-4xl sm:leading-[1.2]">{project.content.brief}</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow">{dict.project.use}</h3>
              <p className="mt-3 text-lg leading-relaxed">{project.content.use}</p>
            </div>
            <div>
              <h3 className="eyebrow">{dict.project.direction}</h3>
              <p className="mt-3 text-lg leading-relaxed">{project.content.direction}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <div className="rounded-[var(--radius-frame)] bg-paper-2 p-6 sm:p-8">
            <h2 className="eyebrow">{dict.project.deliverables}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <Deliverable text={format(dict.project.deliverableItems.still, { w: project.media.image.width, h: project.media.image.height })} />
              {project.media.gif && <Deliverable text={format(dict.project.deliverableItems.gif, { w: project.media.gif.width, h: project.media.gif.height })} />}
              {project.media.video && <Deliverable text={format(dict.project.deliverableItems.video, { w: project.media.video.width, h: project.media.video.height })} />}
            </ul>
            <h2 className="eyebrow mt-8">{dict.project.stack}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <li key={tool} className="rounded-full bg-paper px-4 py-2 font-semibold ring-1 ring-ink/10">
                  {tool}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-3">{dict.disclosure.stack}</p>
          </div>
          <Disclosure text={dict.disclosure.long} />
        </Reveal>
      </section>

      {motionFirst ? (
        <>
          <MotionSection project={project} dict={dict} />
          <FocusSection project={project} dict={dict} />
        </>
      ) : (
        <>
          <FocusSection project={project} dict={dict} />
          <MotionSection project={project} dict={dict} />
        </>
      )}

      {/* Related */}
      <section aria-labelledby="related-title" className="container-x mt-20 sm:mt-28">
        <h2 id="related-title" className="display-md">
          {dict.project.related}
        </h2>
        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.06}>
              <ProjectCard project={p} aspect={["aspect-[4/5]", "aspect-square", "aspect-[4/5]"][i]} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Prev / next */}
      <nav aria-label={`${dict.project.prevProject} / ${dict.project.nextProject}`} className="container-x mt-20 grid gap-4 sm:mt-28 md:grid-cols-2">
        <NeighbourLink project={prev} label={dict.project.prevProject} locale={locale} direction="prev" />
        <NeighbourLink project={next} label={dict.project.nextProject} locale={locale} direction="next" />
      </nav>
    </article>
  );
}

function Deliverable({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-citrus">
        <Check aria-hidden className="size-4" strokeWidth={3} />
      </span>
      <span className="text-[1.0625rem] leading-snug">{text}</span>
    </li>
  );
}

/** Subject-specific focus: tailored notes plus zoomed crops of the same artwork. */
function FocusSection({ project, dict }: { project: Project; dict: Dictionary }) {
  const variant = dict.variants[project.variant];
  const crops = project.details;
  const cols = crops.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <section aria-labelledby="focus-title" className="mt-20 bg-paper-2/70 py-16 sm:mt-28 sm:py-24">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <Reveal>
            <p className="eyebrow">{dict.project.detailsTitle}</p>
            <h2 id="focus-title" className="display-lg mt-4">
              {variant.title}
            </h2>
            <p className="mt-4 text-xl text-ink-2">{variant.intro}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {variant.points.map((point, i) => (
                <li key={point} className="flex items-center gap-4 py-4 text-lg font-semibold">
                  <span className="font-mono text-sm text-ink-3">0{i + 1}</span>
                  {point}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <ul className={`mt-12 grid gap-6 ${cols}`}>
          {crops.map((point, i) => (
            <Reveal as="li" key={`${point.x}-${point.y}`} delay={i * 0.08}>
              <ImageViewerTrigger
                project={project}
                label={`${dict.common.viewFullSize}: ${project.content.detailCaptions[i] ?? project.title}`}
                className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-frame)] shadow-soft md:aspect-[4/5]"
              >
                <Picture
                  fill
                  source={project.media.image}
                  alt={project.content.detailCaptions[i] ?? ""}
                  sizes={crops.length === 3 ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                  focus={point}
                  zoom={2.2}
                  color={project.media.color}
                  imgClassName="transition-transform duration-700 ease-out"
                />
              </ImageViewerTrigger>
              <p className="mt-3 flex items-baseline gap-3 text-lg font-semibold">
                <span className="font-mono text-sm text-ink-3">{String.fromCharCode(65 + i)}</span>
                {project.content.detailCaptions[i]}
              </p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-3">{dict.project.detailsNote}</p>
      </div>
    </section>
  );
}

function MotionSection({ project, dict }: { project: Project; dict: Dictionary }) {
  if (!project.media.video && !project.media.gif) return null;
  return (
    <section aria-labelledby="motion-title" className="container-x mt-20 sm:mt-28">
      <Reveal>
        <p className="eyebrow">{dict.common.motionStudy}</p>
        <h2 id="motion-title" className="display-lg mt-4">
          {dict.project.motionTitle}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        {project.media.video && (
          <div>
            <VideoPlayer
              video={project.media.video}
              title={project.title}
              alt={project.content.alt}
              color={project.media.color}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="rounded-[var(--radius-frame)] shadow-lift"
            />
            <p className="mt-3 font-semibold">{dict.project.mp4Label}</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <GifPreview project={project} />
          <p className="font-semibold">{dict.project.gifLabel}</p>
          <p className="text-ink-2">{dict.disclosure.short}</p>
        </div>
      </div>
    </section>
  );
}

function NeighbourLink({ project, label, locale, direction }: { project: Project; label: string; locale: Locale; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={href(locale, `work/${project.slug}`)}
      rel={direction}
      className={`group flex items-center gap-5 rounded-[var(--radius-frame)] border-2 border-ink p-4 transition-colors hover:bg-ink hover:text-paper sm:p-5 ${direction === "next" ? "md:flex-row-reverse md:text-right" : ""}`}
    >
      <span className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl sm:w-24">
        <Picture fill source={project.media.image} alt="" sizes="96px" focus={project.focus} color={project.media.color} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-mono text-sm font-semibold opacity-80 md:inline-flex">
          {direction === "prev" && <Icon aria-hidden className="size-4" />}
          {label}
          {direction === "next" && <Icon aria-hidden className="size-4" />}
        </span>
        <span className="block truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</span>
      </span>
    </Link>
  );
}
