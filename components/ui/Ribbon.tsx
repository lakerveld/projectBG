import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { TONE_CLASSES, type Tone } from "@/lib/ui/eventVisuals";

type RibbonProps = {
  children: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
};

/**
 * A small heraldic banner used to tag category or verdict. Notched ends give it
 * the look of cut cloth without needing an image asset.
 */
export function Ribbon({ children, tone = "gold", icon: Icon, className }: RibbonProps) {
  const t = TONE_CLASSES[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 bg-gradient-to-r px-3 py-1 font-display text-[0.68rem] font-bold uppercase tracking-[0.18em] text-parchment shadow-seal",
        "[clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)]",
        t.ribbonFrom,
        t.ribbonTo,
        className
      )}
    >
      {Icon ? <Icon size={13} strokeWidth={2.4} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
