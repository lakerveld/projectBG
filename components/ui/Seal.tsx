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

/** Base wax colors per tone: a highlight, the body, and a deep rim. */
const TONE_WAX: Record<Tone, { hi: string; body: string; rim: string; glyph: string }> = {
  gold: { hi: "#f0cf86", body: "#c8942c", rim: "#6f4d14", glyph: "#2a2013" },
  ember: { hi: "#e08a6f", body: "#b4472f", rim: "#5f1f13", glyph: "#2a0f0a" },
  forest: { hi: "#4fae82", body: "#176b4d", rim: "#0a3323", glyph: "#f3ecd8" },
  arcane: { hi: "#9c8ad6", body: "#6d5bb0", rim: "#33285f", glyph: "#f3ecd8" }
};

const SIZES = {
  sm: { box: "size-10", icon: 18 },
  md: { box: "size-14", icon: 24 },
  lg: { box: "size-16", icon: 28 }
} as const;

/**
 * A pressed wax seal used to mark proclamations and roll verdicts. Rendered as a
 * radial-lit disc with a notched rim and an embossed glyph.
 */
export function Seal({ icon: Icon, tone = "gold", size = "md", pulse, label, className }: SealProps) {
  const wax = TONE_WAX[tone];
  const dims = SIZES[size];

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full shadow-seal",
        dims.box,
        pulse && "seal-pulse",
        className
      )}
      style={{
        background: `radial-gradient(circle at 34% 30%, ${wax.hi}, ${wax.body} 52%, ${wax.rim} 100%)`
      }}
    >
      {/* notched rim */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${wax.rim}`,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.28), inset 0 -3px 6px ${wax.rim}`
        }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-[3px] rounded-full opacity-70"
        style={{ border: `1px dashed ${wax.rim}` }}
        aria-hidden="true"
      />
      <Icon size={dims.icon} style={{ color: wax.glyph }} strokeWidth={2.1} aria-hidden="true" />
    </span>
  );
}
