import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { ButtonIcon, ButtonLink, buttonClass } from "@/components/ui/Button";
import { HireLink } from "@/components/layout/HireLink";
import { Reveal } from "@/components/ui/Reveal";
import { expertiseIcons, expertiseTints, type ExpertiseKey } from "@/components/ui/icons";

const HOME_EXPERTISE: ExpertiseKey[] = ["product", "retouch", "composite", "ai", "video", "motion"];

export function ExpertisePreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="expertise-title" className="container-x py-16 sm:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <Reveal>
          <p className="eyebrow">{dict.home.expertiseEyebrow}</p>
          <h2 id="expertise-title" className="display-lg mt-4 max-w-3xl">
            {dict.home.expertiseTitle}
          </h2>
        </Reveal>
        <ButtonLink href={href(locale, "expertise")} variant="outline" icon={ArrowRight} className="self-start">
          {dict.home.expertiseLink}
        </ButtonLink>
      </div>
      <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_EXPERTISE.map((key, i) => {
          const Icon = expertiseIcons[key];
          const group = dict.expertise.groups[key];
          return (
            <Reveal as="li" key={key} delay={(i % 3) * 0.06} className="flex flex-col items-start">
              <span className={`flex size-24 items-center justify-center rounded-full shadow-soft ${expertiseTints[key]}`}>
                <Icon aria-hidden className="size-11" strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">{group.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-2">{group.text}</p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

export function ProcessSteps({ dict, compact = false }: { dict: Dictionary; compact?: boolean }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
      {dict.process.steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 0.06} className="relative flex flex-col rounded-[var(--radius-frame)] bg-paper p-6 shadow-soft ring-1 ring-ink/5">
          <div className="flex items-center justify-between">
            <span className={`flex size-14 items-center justify-center rounded-full font-mono text-lg font-semibold ${["bg-citrus", "bg-coral", "bg-cobalt text-paper", "bg-mint", "bg-ink text-paper"][i]}`}>
              0{i + 1}
            </span>
            {i < dict.process.steps.length - 1 && <ArrowRight aria-hidden className="hidden size-6 text-ink-3 lg:block" />}
          </div>
          <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{step.title}</h3>
          <p className={`mt-2 leading-relaxed text-ink-2 ${compact ? "text-base" : "text-lg"}`}>{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function ProcessPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="process-title" className="bg-paper-2/70 py-16 sm:py-24">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="eyebrow">{dict.home.processEyebrow}</p>
            <h2 id="process-title" className="display-lg mt-4 max-w-3xl">
              {dict.home.processTitle}
            </h2>
          </Reveal>
          <ButtonLink href={href(locale, "process")} variant="outline" icon={ArrowRight} className="self-start">
            {dict.common.discoverProcess}
          </ButtonLink>
        </div>
        <div className="mt-12">
          <ProcessSteps dict={dict} compact />
        </div>
      </div>
    </section>
  );
}

/** Closing invitation — points clients to the Workana profile. */
export function Closing({ locale, dict, title, text }: { locale: Locale; dict: Dictionary; title: string; text?: string }) {
  return (
    <section aria-labelledby="closing-title" className="container-x pt-20 sm:pt-28">
      <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-cobalt px-6 py-14 text-paper sm:px-12 sm:py-20 lg:px-20">
        <div aria-hidden className="absolute -top-24 -right-24 hidden size-96 rounded-full bg-citrus xl:block" />
        <div aria-hidden className="absolute -right-10 -bottom-32 size-56 rounded-full border-[24px] border-coral/80 sm:size-80 sm:border-[28px]" />
        <div className="relative max-w-3xl">
          <h2 id="closing-title" className="display-lg">
            {title}
          </h2>
          {text && <p className="mt-5 text-xl text-paper/90">{text}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            <HireLink newTab={dict.hire.newTab} icon={false} className={buttonClass("citrus")}>
              {dict.hire.cta}
              <ButtonIcon icon={ArrowUpRight} variant="citrus" />
            </HireLink>
            <ButtonLink href={href(locale, "work")} variant="outline" icon={ArrowRight} className="border-paper text-paper hover:bg-paper hover:text-ink">
              {dict.common.exploreWork}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
