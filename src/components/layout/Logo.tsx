import { site } from "@/config/site";

/**
 * Identity mark: an editing frame (crop corners) around a playhead.
 * The same geometry is used for the favicon in public/favicon.svg.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`logo-mark ${className}`}>
      <rect width="48" height="48" rx="14" className="fill-ink" />
      <g className="logo-corners" fill="none" stroke="#f6f4ef" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 18v-8h8" />
        <path d="M30 10h8v8" />
        <path d="M38 30v8h-8" />
        <path d="M18 38h-8v-8" />
      </g>
      <path className="logo-play" d="M20 16.5v15a1.2 1.2 0 0 0 1.8 1l12-7.5a1.2 1.2 0 0 0 0-2l-12-7.5a1.2 1.2 0 0 0-1.8 1Z" fill="#d9ee45" />
    </svg>
  );
}

export function Logo() {
  const [first, second] = site.name.split("/").map((s) => s.trim());
  return (
    <span className="group/logo flex items-center gap-3">
      <LogoMark className="size-11 shrink-0 lg:size-12" />
      <span className="font-display text-[1.1875rem] leading-none font-extrabold tracking-tight whitespace-nowrap lg:text-[1.375rem]">
        {second ? (
          <>
            {first}
            <span className="mx-1 text-cobalt">/</span>
            {second}
          </>
        ) : (
          site.name
        )}
      </span>
    </span>
  );
}
