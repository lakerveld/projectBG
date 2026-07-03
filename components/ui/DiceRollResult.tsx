import { cn } from "@/lib/ui/cn";
import { EVENT_VISUALS, TONE_CLASSES } from "@/lib/ui/eventVisuals";
import { categorizeRoundAverage } from "@/lib/domain/events";
import type { WorldEventCategory } from "@/lib/domain/types";
import { ParchmentCard } from "./ParchmentCard";
import { Ribbon } from "./Ribbon";

type DiceRollResultProps = {
  /** The rolled total (e.g. 2d6 => 2–12) or a round average. */
  total: number;
  /** Who or what this reading belongs to. */
  label: string;
  /** Overrides the auto-derived mood; otherwise inferred from the total. */
  category?: WorldEventCategory;
  /** Small caption under the label, e.g. "3 of 4 realms have rolled". */
  caption?: string;
  /** Replays the settle animation on mount. */
  animate?: boolean;
  className?: string;
};

/**
 * A single reading of the bones, struck like a coin. The number sits on a milled
 * disc and a ribbon reads the world's mood so the table knows the omen at a glance.
 */
export function DiceRollResult({
  total,
  label,
  category,
  caption,
  animate = true,
  className
}: DiceRollResultProps) {
  const mood = category ?? categorizeRoundAverage(total);
  const visual = EVENT_VISUALS[mood];
  const tone = TONE_CLASSES[visual.tone];
  const display = Number.isInteger(total) ? String(total) : total.toFixed(1);

  return (
    <ParchmentCard className={cn("flex items-center gap-4 p-4", className)}>
      {/* Struck coin */}
      <div
        className={cn(
          "relative grid size-[4.5rem] shrink-0 place-items-center rounded-full ring-2 ring-inset shadow-carved",
          tone.ring,
          animate && "dice-settle"
        )}
        style={{
          background:
            "radial-gradient(circle at 36% 28%, #fff6e0, #e7d7b0 55%, #cbb686 100%)"
        }}
      >
        <span className="absolute inset-1.5 rounded-full border border-parchment-edge/70" aria-hidden="true" />
        <span className="font-display text-3xl font-bold leading-none tabular-nums text-sepia">
          {display}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold text-sepia">{label}</p>
        {caption ? (
          <p className="mt-0.5 truncate font-body text-xs text-sepia-muted">{caption}</p>
        ) : null}
        <div className="mt-2">
          <Ribbon tone={visual.tone} icon={visual.icon}>
            {visual.verdict}
          </Ribbon>
        </div>
      </div>
    </ParchmentCard>
  );
}
