import {
  CloudLightning,
  Scale,
  Sprout,
  type LucideIcon
} from "lucide-react";
import type {
  WorldEventCategory,
  WorldEventDuration,
  WorldEventSeverity
} from "@/lib/domain/types";

/** Named accent tones used across the fantasy component set. */
export type Tone = "gold" | "ember" | "forest" | "arcane";

export type EventVisual = {
  /** Short heraldic label for the ribbon (Boon / Portent / Bane). */
  label: string;
  /** One-word verdict used on the dice result. */
  verdict: string;
  tone: Tone;
  icon: LucideIcon;
};

/**
 * Maps a world-event category to its visual identity. Kept in one place so the
 * event card and the dice result always read the same mood the same way.
 */
export const EVENT_VISUALS: Record<WorldEventCategory, EventVisual> = {
  positive_world: {
    label: "Boon",
    verdict: "Bountiful",
    tone: "forest",
    icon: Sprout
  },
  neutral_world: {
    label: "Portent",
    verdict: "Steady",
    tone: "gold",
    icon: Scale
  },
  negative_world: {
    label: "Bane",
    verdict: "Grim",
    tone: "ember",
    icon: CloudLightning
  }
};

export const SEVERITY_LABEL: Record<WorldEventSeverity, string> = {
  minor: "Minor",
  medium: "Notable",
  major: "Dire"
};

/** Number of filled pips (of 3) for a severity level. */
export const SEVERITY_PIPS: Record<WorldEventSeverity, number> = {
  minor: 1,
  medium: 2,
  major: 3
};

export const DURATION_LABEL: Record<WorldEventDuration, string> = {
  instant: "This moment",
  "1_round": "One round",
  "2_rounds": "Two rounds"
};

/** Tailwind class fragments per tone, resolved at build time (no dynamic classes). */
export const TONE_CLASSES: Record<
  Tone,
  { text: string; ring: string; ribbonFrom: string; ribbonTo: string; dot: string }
> = {
  gold: {
    text: "text-gold",
    ring: "ring-gold/40",
    ribbonFrom: "from-[#8a5f18]",
    ribbonTo: "to-[#c8942c]",
    dot: "bg-gold"
  },
  ember: {
    text: "text-ember",
    ring: "ring-ember/40",
    ribbonFrom: "from-[#6f2417]",
    ribbonTo: "to-[#b4472f]",
    dot: "bg-ember"
  },
  forest: {
    text: "text-forest",
    ring: "ring-forest/40",
    ribbonFrom: "from-[#0c3d2b]",
    ribbonTo: "to-[#176b4d]",
    dot: "bg-forest"
  },
  arcane: {
    text: "text-arcane",
    ring: "ring-arcane/40",
    ribbonFrom: "from-[#39307a]",
    ribbonTo: "to-[#6d5bb0]",
    dot: "bg-arcane"
  }
};
