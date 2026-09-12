import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { type Tone } from "@/lib/ui/eventVisuals";

type RibbonProps = {
  children: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
};

/** Compact category sticker with a high-contrast outline. */
export function Ribbon({ children, tone = "gold", icon: Icon, className }: RibbonProps) {
  const tones = {
    gold: "bg-gold",
    ember: "bg-[#ff91c4]",
    forest: "bg-[#a9dec5]",
    arcane: "bg-[#c681f5]"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-ink rounded-sm px-3 py-1 font-display text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink shadow-seal",
        tones[tone],
        className
      )}
    >
      {Icon ? <Icon size={13} strokeWidth={2.4} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
