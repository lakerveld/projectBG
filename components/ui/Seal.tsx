import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui/cn";
import type { Tone } from "@/lib/ui/eventVisuals";

type SealProps = {
  icon: LucideIcon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Slow breathing glow, for active / current accents. */
  pulse?: boolean;
  label?: string;
  className?: string;
};

/** Flat sticker colors share the illustration's accent palette. */
const TONE_COLORS: Record<Tone, string> = {
  gold: "#d5fa55",
  ember: "#ff91c4",
  forest: "#a9dec5",
  arcane: "#c681f5"
};

const SIZES = {
  sm: { box: "size-10", icon: 18 },
  md: { box: "size-14", icon: 24 },
  lg: { box: "size-16", icon: 28 }
} as const;

/** Circular icon sticker with an ink outline. */
export function Seal({
  icon: Icon,
  tone = "gold",
  size = "md",
  pulse,
  label,
  className
}: SealProps) {
  const color = TONE_COLORS[tone];
  const dims = SIZES[size];

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border-2 border-ink shadow-seal",
        dims.box,
        pulse && "seal-pulse",
        className
      )}
      style={{ background: color }}
    >
      <Icon size={dims.icon} style={{ color: "#171722" }} strokeWidth={2.1} aria-hidden="true" />
    </span>
  );
}
