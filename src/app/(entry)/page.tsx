import { LOCALE_STORAGE_KEY, htmlLang, locales, defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LogoMark } from "@/components/layout/Logo";

/**
 * Language entry point for "/". Runs before paint:
 * 1. saved selection → 2. browser language → 3. English.
 */
const redirectScript = `(function(){try{var L=${JSON.stringify(locales)},s=null;try{s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}
var pick=L.indexOf(s)>-1?s:null;if(!pick){var n=navigator.languages||[navigator.language||""];for(var i=0;i<n.length&&!pick;i++){var b=String(n[i]).toLowerCase().split("-")[0];if(L.indexOf(b)>-1)pick=b}}
location.replace("/"+(pick||${JSON.stringify(defaultLocale)})+"/"+location.search+location.hash)}catch(e){location.replace("/${defaultLocale}/")}})();`;

export default function Entry() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <LogoMark className="size-16" />
      <ul className="flex flex-wrap justify-center gap-3">
        {locales.map((l) => (
          <li key={l}>
            <a lang={htmlLang[l]} href={`/${l}/`} className="inline-flex min-h-12 items-center rounded-full border-2 border-ink px-6 text-lg font-semibold hover:bg-ink hover:text-paper">
              {getDictionary(l).nav.languageNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
