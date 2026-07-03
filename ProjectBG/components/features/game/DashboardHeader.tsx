"use client";

import { memo } from "react";
import { Settings2 } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import type { WorldEvent } from "@/lib/domain/types";
import { cn } from "@/lib/ui/cn";

type DashboardHeaderProps = {
  round: number;
  currentPlayerName?: string;
  activeWorldEvent?: WorldEvent;
  onSettings?: () => void;
  className?: string;
};

export const DashboardHeader = memo(function DashboardHeader({
  round,
  currentPlayerName,
  activeWorldEvent,
  onSettings,
  className
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-parchment-edge/40 bg-night-deep/86 px-4 py-3 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.32em] text-gold/80">
            Round {round}
          </p>
          <p className="mt-0.5 truncate font-display text-xl font-bold text-parchment">
            {currentPlayerName ? `${currentPlayerName}'s Turn` : "Awaiting turn"}
          </p>
          {activeWorldEvent ? (
            <p className="mt-0.5 truncate font-body text-sm text-parchment/78">
              {activeWorldEvent.name}
            </p>
          ) : null}
        </div>

        <ActionButton
          type="button"
          variant="ghost"
          size="sm"
          icon={Settings2}
          aria-label="Settings"
          onClick={onSettings}
          className="shrink-0 border border-parchment-edge/30 bg-white/5"
        />
      </div>
    </header>
  );
});
