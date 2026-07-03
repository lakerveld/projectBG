import { Hourglass } from "lucide-react";
import { cn } from "@/lib/ui/cn";
import {
  DURATION_LABEL,
  EVENT_VISUALS,
  SEVERITY_LABEL,
  SEVERITY_PIPS,
  TONE_CLASSES
} from "@/lib/ui/eventVisuals";
import type { WorldEvent } from "@/lib/domain/types";
import { ParchmentCard } from "./ParchmentCard";
import { Ribbon } from "./Ribbon";
import { Seal } from "./Seal";

type WorldEventCardProps = {
  event: WorldEvent;
  /** Optional round number shown as the decree's ordinal. */
  round?: number;
  className?: string;
};

/**
 * The centrepiece: a world event presented as an illuminated royal proclamation.
 * A pressed wax seal overlaps the top edge, a ribbon names the omen, and the
 * decree body carries the effects the table must honour.
 */
export function WorldEventCard({ event, round, className }: WorldEventCardProps) {
  const visual = EVENT_VISUALS[event.category];
  const tone = TONE_CLASSES[visual.tone];
  const pips = SEVERITY_PIPS[event.severity];

  return (
    <ParchmentCard variant="raised" className={cn("pt-9", className)}>
      {/* Seal breaks the top edge, overlapping the card like real wax. */}
      <div className="absolute -top-4 left-5 z-10">
        <Seal icon={visual.icon} tone={visual.tone} size="lg" pulse label={`${visual.label} omen`} />
      </div>

      <div className="absolute right-4 top-4">
        <Ribbon tone={visual.tone}>{visual.label}</Ribbon>
      </div>

      <div className="px-5 pb-5 pt-3">
        <p className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-sepia-muted">
          {round ? `Decree of Round ${round}` : "A world decree"}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold leading-tight text-sepia">
          {event.name}
        </h3>

        {/* Filigree rule */}
        <div className="my-3 flex items-center gap-2" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-parchment-edge to-transparent" />
          <span className={cn("size-1.5 rotate-45", tone.dot)} />
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-parchment-edge to-transparent" />
        </div>

        <p className="font-body text-[0.95rem] leading-6 text-sepia/90">{event.description}</p>

        {event.effectsApplied.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {event.effectsApplied.map((effect) => (
              <li
                key={effect}
                className="flex gap-2.5 rounded-lg border border-parchment-edge/50 bg-[#e6d7b4]/50 px-3 py-2 font-body text-sm leading-5 text-sepia"
              >
                <span className={cn("mt-1.5 size-1.5 shrink-0 rotate-45", tone.dot)} aria-hidden="true" />
                {effect}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Footer: severity pips + duration */}
        <div className="mt-4 flex items-center justify-between border-t border-parchment-edge/60 pt-3">
          <div className="flex items-center gap-2">
            <span className="font-body text-[0.7rem] uppercase tracking-widest text-sepia-muted">
              {SEVERITY_LABEL[event.severity]}
            </span>
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "size-2 rounded-full",
                    i < pips ? tone.dot : "bg-parchment-edge/60"
                  )}
                />
              ))}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-body text-[0.72rem] uppercase tracking-widest text-sepia-muted">
            <Hourglass size={13} aria-hidden="true" />
            {DURATION_LABEL[event.duration]}
          </span>
        </div>
      </div>
    </ParchmentCard>
  );
}
