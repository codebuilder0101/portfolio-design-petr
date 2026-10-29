"use client";

import { useEffect } from "react";
import { htmlLang } from "@/i18n/config";
import { useI18n } from "./I18nProvider";

/** Keeps <html lang> correct after client-side language switches. */
export function LocaleSync() {
  const { locale } = useI18n();
  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];
  }, [locale]);
  return null;
}
