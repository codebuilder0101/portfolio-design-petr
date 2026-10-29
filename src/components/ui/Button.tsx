import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Variant = "solid" | "outline" | "citrus";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-cobalt",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
  citrus: "bg-citrus text-ink hover:bg-ink hover:text-paper",
};

export function buttonClass(variant: Variant = "solid", extra = "") {
  return `group/btn inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-6 text-lg font-semibold tracking-tight transition-colors duration-200 sm:px-7 ${styles[variant]} ${extra}`;
}

/** Circular icon badge used inside buttons. */
export function ButtonIcon({ icon: Icon, variant = "solid" }: { icon: LucideIcon; variant?: Variant }) {
  const tone = variant === "solid" ? "bg-paper text-ink" : variant === "citrus" ? "bg-ink text-citrus" : "bg-ink text-paper group-hover/btn:bg-paper group-hover/btn:text-ink";
  return (
    <span aria-hidden className={`-mr-3 flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover/btn:translate-x-0.5 ${tone}`}>
      <Icon className="size-[18px]" strokeWidth={2.25} />
    </span>
  );
}

export function ButtonLink({ href, variant = "solid", icon, children, className = "" }: { href: string; variant?: Variant; icon?: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
      {icon && <ButtonIcon icon={icon} variant={variant} />}
    </Link>
  );
}
