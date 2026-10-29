import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import { site } from "@/config/site";
import { icons } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  icons,
  alternates: { languages: { en: "/en/", "pt-BR": "/pt/", es: "/es/", "x-default": "/en/" } },
};

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
