import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Layout recipe for the eight featured slots: varied proportions, one outlined frame, one wide closer. */
const SLOTS = [
  { cls: "md:col-span-7", aspect: "aspect-[5/4]", size: "lg", sizes: "(min-width: 768px) 56vw, 100vw" },
  { cls: "md:col-span-5 md:mt-32", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 40vw, 100vw" },
  { cls: "md:col-span-5", aspect: "aspect-square", sizes: "(min-width: 768px) 40vw, 100vw" },
  { cls: "md:col-span-7 md:-mt-0 lg:mt-20", aspect: "aspect-[3/2]", size: "lg", sizes: "(min-width: 768px) 56vw, 100vw" },
  { cls: "md:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 32vw, 100vw" },
  { cls: "md:col-span-4 md:mt-16", aspect: "aspect-square", outlined: true, sizes: "(min-width: 768px) 32vw, 100vw" },
  { cls: "md:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 32vw, 100vw" },
  { cls: "md:col-span-12", aspect: "aspect-[3/2] md:aspect-[21/9]", size: "lg", sizes: "100vw" },
] as const;

export function FeaturedWork({ projects, locale, dict }: { projects: Project[]; locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="featured-title" className="container-x py-16 sm:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <Reveal>
          <p className="eyebrow">{dict.home.featuredEyebrow}</p>
          <h2 id="featured-title" className="display-lg mt-4 max-w-4xl">
            {dict.home.featuredTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-xl text-ink-2">{dict.home.featuredIntro}</p>
        </Reveal>
        <ButtonLink href={href(locale, "work")} variant="outline" icon={ArrowRight} className="self-start lg:self-end">
          {dict.common.seeAll}
        </ButtonLink>
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:mt-16 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
        {projects.map((project, i) => {
          const slot = SLOTS[i % SLOTS.length];
          return (
            <Reveal as="li" key={project.id} className={slot.cls} delay={(i % 2) * 0.08}>
              <ProjectCard
                project={project}
                aspect={slot.aspect}
                sizes={slot.sizes}
                size={"size" in slot ? slot.size : "md"}
                outlined={"outlined" in slot ? slot.outlined : false}
              />
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
