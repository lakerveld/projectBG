import {
  Coins,
  Dices,
  Feather,
  ScrollText,
  Sparkles,
  Swords,
  UserPlus,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/ui/cn";
import type { HistoryEntry, HistoryEntryType } from "@/lib/domain/types";
import type { Tone } from "@/lib/ui/eventVisuals";
import { TONE_CLASSES } from "@/lib/ui/eventVisuals";
import { ParchmentCard } from "./ParchmentCard";
import { EmptyState } from "./EmptyState";

type EventHistoryProps = {
  entries: HistoryEntry[];
  title?: string;
  className?: string;
};

const ENTRY_STYLE: Record<HistoryEntryType, { icon: LucideIcon; tone: Tone }> = {
  "game.created": { icon: Sparkles, tone: "gold" },
  "game.started": { icon: Swords, tone: "arcane" },
  "dice.recorded": { icon: Dices, tone: "gold" },
  "world_event.applied": { icon: ScrollText, tone: "arcane" },
  "player.added": { icon: UserPlus, tone: "forest" },
  "resource.adjusted": { icon: Coins, tone: "forest" },
  "correction.added": { icon: Feather, tone: "ember" }
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(date);
}

/**
 * The chronicle: a running record of the table's deeds, drawn as an inked
 * timeline. Newest entries are expected first (the caller decides order).
 */
export function EventHistory({ entries, title = "The Chronicle", className }: EventHistoryProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ScrollText}
        title="The chronicle is bare"
        description="Deeds recorded at the table — rolls, decrees, and trades — will be inked here as the game unfolds."
        className={className}
      />
    );
  }

  return (
    <ParchmentCard className={cn("p-4", className)}>
      <h3 className="mb-3 font-display text-base font-bold uppercase tracking-wide text-sepia">
        {title}
      </h3>
      <ol className="relative ml-1.5 space-y-3 border-l border-dashed border-parchment-edge pl-5">
        {entries.map((entry) => {
          const style = ENTRY_STYLE[entry.type] ?? { icon: Feather, tone: "gold" as Tone };
          const Icon = style.icon;
          const time = formatTime(entry.createdAt);

          return (
            <li key={entry.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.83rem] grid size-7 place-items-center rounded-full border border-parchment-edge bg-parchment text-sepia shadow-carved",
                  TONE_CLASSES[style.tone].text
                )}
                aria-hidden="true"
              >
                <Icon size={14} strokeWidth={2.3} />
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-body text-sm leading-5 text-sepia">{entry.message}</p>
                {time ? (
                  <time
                    dateTime={entry.createdAt}
                    className="shrink-0 font-body text-[0.68rem] uppercase tracking-widest text-sepia-muted tabular-nums"
                  >
                    {time}
                  </time>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </ParchmentCard>
  );
}
