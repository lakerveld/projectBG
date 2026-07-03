"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dice5, ScrollText } from "lucide-react";
import { ActiveEventBanner } from "@/components/features/game/ActiveEventBanner";
import { DashboardHeader } from "@/components/features/game/DashboardHeader";
import { KingdomMap } from "@/components/features/game/KingdomMap";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { useGameStore } from "@/lib/state/gameStore";

export function GameDashboard() {
  const router = useRouter();
  const { game, error, hydrate } = useGameStore();
  const currentTurnPlayer = game.players.find((player) => player.id === game.currentTurnPlayerId);
  const roundRolls = game.currentRoundRolls ?? [];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (game.setupStatus !== "in-progress" || game.players.length === 0) {
    return (
      <div className="grid h-[calc(100dvh-8.5rem)] place-items-center">
        <EmptyState
          icon={ScrollText}
          title="No realms have gathered"
          description="Create a game and add players before opening the kingdom dashboard."
        />
      </div>
    );
  }

  return (
    <section className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-3 overflow-hidden">
      <DashboardHeader
        round={game.round}
        currentPlayerName={currentTurnPlayer?.name}
        activeWorldEvent={game.activeWorldEvent}
        onSettings={() => router.push("/")}
      />

      <div className="relative mx-3 min-h-0 overflow-hidden rounded-[1.5rem] border border-parchment-edge/50 shadow-parchment">
        <KingdomMap
          players={game.players}
          resources={game.resources}
          currentTurnPlayerId={game.currentTurnPlayerId}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center p-3">
          <ActiveEventBanner event={game.activeWorldEvent} />
        </div>
      </div>

      <ParchmentCard className="mx-3 mb-3 p-3 shadow-parchment">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[0.68rem] uppercase tracking-[0.26em] text-sepia-muted">
              {roundRolls.length}/{game.players.length} rolled
            </p>
            <p className="truncate font-display text-lg font-bold text-sepia">
              {currentTurnPlayer?.name ?? "Next player"} is ready
            </p>
          </div>
          <ActionButton
            icon={Dice5}
            onClick={() => router.push("/roll")}
            size="lg"
            className="shrink-0 px-4"
          >
            Start Rolling
          </ActionButton>
        </div>
      </ParchmentCard>

      {error ? <p className="px-1 font-body text-sm font-semibold text-ember">{error}</p> : null}
    </section>
  );
}
