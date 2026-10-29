import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { countByCategory, getProjects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { WorkExplorer } from "@/components/work/WorkExplorer";
import { Disclosure } from "@/components/project/Disclosure";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, title: dict.meta.work.title, description: dict.meta.work.description, path: "work" });
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return (
    <div className="container-x pt-8 sm:pt-12">
      <header className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:pb-10">
        <div>
          <p className="eyebrow">{dict.work.eyebrow}</p>
          <h1 className="display-xl mt-4">{dict.work.title}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl text-ink-2">{dict.work.intro}</p>
          <Disclosure text={dict.disclosure.short} />
        </div>
      </header>
      <WorkExplorer projects={getProjects(locale)} counts={countByCategory()} />
    </div>
  );
}
