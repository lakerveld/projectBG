"use client";

import { memo } from "react";
import { Dices } from "lucide-react";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { cn } from "@/lib/ui/cn";

export type RoundRollSummary = {
  playerId: string;
  playerName: string;
  playerColor: string;
  total: number;
};

type RoundRollsPanelProps = {
  roundRolls: RoundRollSummary[];
  className?: string;
};

export const RoundRollsPanel = memo(function RoundRollsPanel({
  roundRolls,
  className
}: RoundRollsPanelProps) {
  return (
    <ParchmentCard className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.28em] text-gold/80">
            Previous rolls
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-sepia">This round</h2>
        </div>
        <span className="grid size-11 place-items-center rounded-full border border-parchment-edge/70 bg-[#e6d7b4]/55 text-sepia shadow-carved">
          <Dices size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
      </div>

      {roundRolls.length > 0 ? (
        <ul className="mt-4 grid gap-1.5">
          {roundRolls.map((roll) => (
            <li
              key={roll.playerId}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-parchment-edge/50 bg-white/35 px-2.5 py-2"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: roll.playerColor }}
                aria-hidden="true"
              />
              <span className="truncate font-body text-sm font-semibold text-sepia">
                {roll.playerName}
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-night/85 font-display text-base font-bold text-gold">
                {roll.total}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-body text-sm font-semibold text-sepia/65">
          No dice entered yet.
        </p>
      )}
    </ParchmentCard>
  );
});
