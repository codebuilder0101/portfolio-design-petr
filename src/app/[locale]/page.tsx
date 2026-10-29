import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CATEGORY_PICKS, FEATURED_ORDER, HERO_IDS, MOTION_SHOWCASE_IDS, categoryIds, countByCategory, getProjectsByIds } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/config/site";
import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { BriefFinder } from "@/components/home/BriefFinder";
import { MotionShowcase } from "@/components/home/MotionShowcase";
import { Closing, ExpertisePreview, ProcessPreview } from "@/components/home/ExpertiseAndProcess";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { ...pageMetadata({ locale, title: dict.meta.home.title, description: dict.meta.home.description }), title: { absolute: `${dict.meta.home.title} · ${site.name}` } };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const picks = Object.fromEntries(categoryIds.map((c) => [c, getProjectsByIds(locale, CATEGORY_PICKS[c])])) as Parameters<typeof BriefFinder>[0]["picks"];

  return (
    <>
      <Hero projects={getProjectsByIds(locale, HERO_IDS)} />
      <FeaturedWork projects={getProjectsByIds(locale, FEATURED_ORDER)} locale={locale} dict={dict} />
      <BriefFinder locale={locale} dict={dict} counts={countByCategory()} picks={picks} />
      <MotionShowcase projects={getProjectsByIds(locale, MOTION_SHOWCASE_IDS)} />
      <ExpertisePreview locale={locale} dict={dict} />
      <ProcessPreview locale={locale} dict={dict} />
      <Closing locale={locale} dict={dict} title={dict.home.closingTitle} text={dict.home.closingText} />
    </>
  );
}
