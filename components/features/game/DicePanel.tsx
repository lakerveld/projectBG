"use client";

import { memo } from "react";
import { Dice5, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { cn } from "@/lib/ui/cn";

type DicePanelProps = {
  round: number;
  currentPlayerName?: string;
  selectedTotal: number | null;
  diceTotals: number[];
  roundRolls: number;
  playerCount: number;
  onSelectTotal: (total: number) => void;
  onApplyRoll: () => void;
  canApply: boolean;
  className?: string;
};

export const DicePanel = memo(function DicePanel({
  round,
  currentPlayerName,
  selectedTotal,
  diceTotals,
  roundRolls,
  playerCount,
  onSelectTotal,
  onApplyRoll,
  canApply,
  className
}: DicePanelProps) {
  return (
    <ParchmentCard className={cn("p-4 shadow-parchment", className)}>
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-gold/80">Dice</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-sepia">Round {round}</h2>
            <p className="mt-1 font-body text-sm leading-6 text-sepia/72">
              {currentPlayerName ?? "Unknown realm"} is at the bones.
            </p>
          </div>
          <div className="rounded-full border border-parchment-edge/70 bg-[#e6d7b4]/50 px-3 py-1 text-right">
            <p className="font-display text-[0.65rem] uppercase tracking-[0.28em] text-sepia-muted">
              Progress
            </p>
            <p className="font-display text-lg font-bold text-sepia">
              {roundRolls}/{playerCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2" aria-label="Dice totals">
          {diceTotals.map((total) => (
            <button
              key={total}
              type="button"
              onClick={() => onSelectTotal(total)}
              className={cn(
                "grid min-h-11 place-items-center rounded-xl border font-display text-sm font-bold shadow-carved transition",
                selectedTotal === total
                  ? "border-gold bg-gold text-night-deep"
                  : "border-parchment-edge bg-[#e6d7b4]/50 text-sepia hover:bg-[#f1e1bf]"
              )}
            >
              {total}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-parchment-edge/60 bg-night/5 px-3 py-2">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.26em] text-sepia-muted">
            Producing
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold text-sepia">
            <Badge icon={Sparkles} label="Resolve" />
            <Badge label="Resources" />
            <Badge label="Event" />
          </div>
        </div>

        <ActionButton
          icon={Dice5}
          onClick={onApplyRoll}
          disabled={!canApply}
          fullWidth
          className="shadow-glow"
        >
          Apply Roll
        </ActionButton>
      </div>
    </ParchmentCard>
  );
});

function Badge({ label, icon: Icon }: { label: string; icon?: typeof Sparkles }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-parchment-edge/60 bg-white/40 px-2.5 py-1 font-display text-[0.68rem] uppercase tracking-[0.2em] text-sepia">
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
