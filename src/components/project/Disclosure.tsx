import { Info } from "lucide-react";

/** Concise, consistent disclosure for AI-generated concept work. */
export function Disclosure({ text, title, className = "" }: { text: string; title?: string; className?: string }) {
  return (
    <aside className={`flex gap-3 rounded-2xl border border-ink/10 bg-mint/30 p-4 text-ink ${className}`}>
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-2" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-[0.9375rem] leading-relaxed text-ink-2">{text}</p>
      </div>
    </aside>
  );
}
