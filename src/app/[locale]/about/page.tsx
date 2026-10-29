import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { Disclosure } from "@/components/project/Disclosure";
import { Picture } from "@/components/media/Picture";
import { portraits } from "@/data/portraits";
import { Reveal } from "@/components/ui/Reveal";
import { Closing } from "@/components/home/ExpertiseAndProcess";
import { HireLink } from "@/components/layout/HireLink";
import { buttonClass } from "@/components/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, title: dict.meta.about.title, description: dict.meta.about.description, path: "about" });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const a = dict.about;
  return (
    <>
      <header className="container-x grid gap-12 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="eyebrow">{a.eyebrow}</p>
          <h1 className="display-xl mt-4">{a.title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-2 sm:text-[1.375rem]">{a.intro}</p>
          <HireLink newTab={dict.hire.newTab} className={buttonClass("solid", "mt-8")}>
            {dict.hire.cta}
          </HireLink>
        </div>
        <figure className="relative mx-auto w-full max-w-md lg:mr-0">
          <div aria-hidden className="absolute -top-6 -right-2 size-40 sm:-right-6 rounded-full bg-citrus sm:size-52" />
          <div aria-hidden className="absolute -bottom-6 -left-2 size-28 sm:-left-6 rounded-full border-[14px] border-coral/80 sm:size-36" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-frame)] shadow-lift">
            <Picture fill priority source={portraits.about.image} alt={a.portraitAlt} sizes="(min-width: 1024px) 28rem, 90vw" focus={{ x: 50, y: 35 }} color={portraits.about.color} />
          </div>
          <figcaption className="absolute bottom-5 left-5 rounded-full bg-paper/95 px-4 py-2 font-display text-lg font-bold tracking-tight shadow-soft backdrop-blur">
            Petr Smital
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="approach-title" className="container-x mt-20 sm:mt-28">
        <h2 id="approach-title" className="display-lg">
          {a.approachTitle}
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {a.approach.map((text, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="border-t-2 border-ink pt-6">
              <span className="font-mono text-sm font-semibold text-ink-3">0{i + 1}</span>
              <p className="mt-3 text-xl leading-relaxed">{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="focus-title" className="mt-20 bg-paper-2/70 py-16 sm:mt-28 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <h2 id="focus-title" className="display-lg">
            {a.focusTitle}
          </h2>
          <ul className="flex flex-col">
            {a.focus.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 0.04} className="flex items-center gap-4 border-b border-line py-4">
                <span aria-hidden className={`size-3 shrink-0 rounded-full ${["bg-cobalt", "bg-citrus", "bg-coral", "bg-mint"][i % 4]}`} />
                <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="collection-title" className="container-x mt-20 sm:mt-28">
        <div className="max-w-4xl">
          <h2 id="collection-title" className="display-md">
            {a.collectionTitle}
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-ink-2">{a.collectionText}</p>
          <Disclosure text={dict.disclosure.short} className="mt-6" />
        </div>
      </section>

      <Closing locale={locale} dict={dict} title={dict.hire.title} text={dict.hire.text} />
    </>
  );
}
