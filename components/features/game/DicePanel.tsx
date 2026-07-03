"use client";

import { memo } from "react";
import Image from "next/image";
import { Dice5 } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { getPlayerAvatar } from "@/lib/domain/avatars";
import { cn } from "@/lib/ui/cn";
import type { Player } from "@/lib/domain/types";

type RoundRollSummary = {
  playerId: string;
  playerName: string;
  playerColor: string;
  total: number;
};

type DicePanelProps = {
  round: number;
  currentPlayer?: Player;
  selectedTotal: number | null;
  diceTotals: number[];
  roundRolls: RoundRollSummary[];
  playerCount: number;
  onSelectTotal: (total: number) => void;
  onApplyRoll: () => void;
  canApply: boolean;
  className?: string;
};

export const DicePanel = memo(function DicePanel({
  round,
  currentPlayer,
  selectedTotal,
  diceTotals,
  roundRolls,
  playerCount,
  onSelectTotal,
  onApplyRoll,
  canApply,
  className
}: DicePanelProps) {
  const avatar = getPlayerAvatar(currentPlayer?.avatarId);
  const initial = currentPlayer?.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <ParchmentCard className={cn("p-4 shadow-parchment", className)}>
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-gold/80">Dice</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-sepia">Round {round}</h2>
          </div>
          <div className="rounded-full border border-parchment-edge/70 bg-[#e6d7b4]/50 px-3 py-1 text-right">
            <p className="font-display text-[0.65rem] uppercase tracking-[0.28em] text-sepia-muted">
              Progress
            </p>
            <p className="font-display text-lg font-bold text-sepia">
              {roundRolls.length}/{playerCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-parchment-edge/60 bg-[#e6d7b4]/45 p-3 shadow-carved">
          <span
            className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] bg-[#e6d7b4] font-display text-xl font-bold text-white"
            style={{
              borderColor: currentPlayer?.color,
              backgroundColor: avatar ? undefined : currentPlayer?.color
            }}
            aria-hidden="true"
          >
            {avatar ? (
              <Image
                src={avatar.src}
                alt=""
                width={56}
                height={56}
                className="size-full object-cover"
                draggable={false}
              />
            ) : (
              initial
            )}
          </span>
          <div className="min-w-0">
            <p className="font-display text-[0.68rem] uppercase tracking-[0.24em] text-sepia-muted">
              Throwing
            </p>
            <p className="truncate font-display text-xl font-bold text-sepia">
              {currentPlayer?.name ?? "Unknown realm"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5" aria-label="Dice totals">
          {diceTotals.map((total) => (
            <button
              key={total}
              type="button"
              onClick={() => onSelectTotal(total)}
              className={cn(
                "grid min-h-16 place-items-center rounded-xl border font-display text-2xl font-bold shadow-carved transition active:scale-[0.98]",
                selectedTotal === total
                  ? "border-gold bg-gold text-night-deep"
                  : "border-parchment-edge bg-[#e6d7b4]/50 text-sepia hover:bg-[#f1e1bf]"
              )}
            >
              {total}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-parchment-edge/60 bg-night/5 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[0.7rem] uppercase tracking-[0.26em] text-sepia-muted">
              Previous rolls
            </p>
            <p className="font-display text-xs font-bold text-sepia-muted">This round</p>
          </div>
          {roundRolls.length > 0 ? (
            <ul className="mt-2 grid gap-1.5">
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
            <p className="mt-2 font-body text-sm font-semibold text-sepia/65">
              No dice entered yet.
            </p>
          )}
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
