import type { Metadata } from "next";
import { Check, WandSparkles } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProjectsByIds } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Closing } from "@/components/home/ExpertiseAndProcess";

export async function generateMetadata({ params }: PageProps<"/[locale]/process">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, title: dict.meta.process.title, description: dict.meta.process.description, path: "process" });
}

/** One illustrative artwork per stage, chosen for mood rather than as a literal step record. */
const STEP_ART = [57, 36, 58, 32, 49];
const STEP_TONES = ["bg-citrus", "bg-coral", "bg-cobalt text-paper", "bg-mint", "bg-ink text-paper"];

export default async function ProcessPage({ params }: PageProps<"/[locale]/process">) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const art = getProjectsByIds(locale, STEP_ART);
  const [first, ...rest] = dict.process.title.split("→").map((s) => s.trim());

  return (
    <>
      <header className="container-x pt-8 sm:pt-12">
        <p className="eyebrow">{dict.process.eyebrow}</p>
        <h1 className="display-xl mt-4 max-w-6xl">
          {first}
          {rest.map((word) => (
            <span key={word}>
              {" "}
              <span aria-hidden className="text-cobalt">
                →
              </span>
              <span className="sr-only">,</span> {word}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-ink-2">{dict.process.intro}</p>
      </header>

      <ol className="container-x mt-14 flex flex-col gap-6 sm:mt-20 sm:gap-8">
        {dict.process.steps.map((step, i) => {
          const p = art[i];
          const flip = i % 2 === 1;
          return (
            <Reveal as="li" key={step.title} className="grid items-center gap-6 rounded-[2.25rem] bg-paper-2/70 p-4 sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
              <div className={`relative aspect-[3/2] overflow-hidden rounded-[var(--radius-frame)] ${flip ? "lg:order-2" : ""}`}>
                {p && <Picture fill source={p.media.image} alt="" sizes="(min-width: 1024px) 45vw, 100vw" focus={p.focus} color={p.media.color} />}
                <span className={`absolute top-4 left-4 flex size-16 items-center justify-center rounded-full font-mono text-xl font-semibold shadow-soft ${STEP_TONES[i]}`}>
                  0{i + 1}
                </span>
              </div>
              <div className="px-2 pb-4 lg:px-0 lg:pb-0">
                <h2 className="display-lg">{step.title}</h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">{step.text}</p>
                <h3 className="eyebrow mt-8">{dict.process.outputsLabel}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {step.outputs.map((o) => (
                    <li key={o} className="flex items-center gap-3 text-lg font-semibold">
                      <Check aria-hidden className="size-5 shrink-0 text-cobalt" strokeWidth={3} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <section className="container-x mt-16 grid gap-6 sm:mt-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Reveal className="rounded-[2.25rem] bg-mint/40 p-8 sm:p-12">
          <span className="flex size-20 items-center justify-center rounded-full bg-ink text-mint">
            <WandSparkles aria-hidden className="size-9" strokeWidth={1.75} />
          </span>
          <h2 className="display-md mt-6">{dict.process.aiTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed sm:text-xl">{dict.process.aiText}</p>
        </Reveal>
        <Reveal delay={0.08} className="rounded-[2.25rem] border-2 border-ink p-8 sm:p-12">
          <h2 className="display-md">{dict.process.formatsTitle}</h2>
          <dl className="mt-6 divide-y divide-line">
            {dict.process.formats.map((f) => (
              <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="font-mono text-sm font-semibold tracking-wide text-ink-2 uppercase">{f.label}</dt>
                <dd className="text-lg font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <Closing locale={locale} dict={dict} title={dict.process.closingTitle} />
    </>
  );
}
