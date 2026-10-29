import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { MotionConfig } from "motion/react";
import "../globals.css";
import { fontVariables } from "../fonts";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/config/site";
import { icons } from "@/lib/metadata";
import { I18nProvider } from "@/components/layout/I18nProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocaleSync } from "@/components/layout/LocaleSync";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${dict.meta.role}`, template: `%s · ${site.name}` },
    description: dict.meta.siteDescription,
    applicationName: site.name,
    icons,
    manifest: "/site.webmanifest",
    robots: site.hasRealDomain ? undefined : { index: false, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={fontVariables} id="top">
      <body className="min-h-dvh">
        <I18nProvider locale={locale} dict={dict}>
          <MotionConfig reducedMotion="user">
            <LocaleSync />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={locale} dict={dict} />
          </MotionConfig>
        </I18nProvider>
      </body>
    </html>
  );
}
