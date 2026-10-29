import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";

type Props = {
  children: React.ReactNode;
  /** Screen-reader note that the link opens a new tab. */
  newTab: string;
  className?: string;
  icon?: boolean;
  onClick?: () => void;
};

/** External link to the Workana profile, opened in a new tab. */
export function HireLink({ children, newTab, className = "", icon = true, onClick }: Props) {
  return (
    <a href={site.hire.url} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} data-hire-link>
      {children}
      <span className="sr-only"> ({newTab})</span>
      {icon && <ArrowUpRight aria-hidden className="size-5 shrink-0" strokeWidth={2.25} />}
    </a>
  );
}
