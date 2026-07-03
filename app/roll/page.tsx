"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ScrollText } from "lucide-react";
import { DicePanel } from "@/components/features/game/DicePanel";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGameStore } from "@/lib/state/gameStore";
import { playEventSoundOnce } from "@/lib/ui/useEventSound";

export default function RollPage() {
  const router = useRouter();
  const { game, error, hydrate, recordDiceTotal } = useGameStore();
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const currentTurnPlayer = game.players.find((player) => player.id === game.currentTurnPlayerId);
  const diceTotals = useMemo(() => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], []);
  const roundRolls = game.currentRoundRolls ?? [];
  const roundRollSummaries = roundRolls.map((roll) => {
    const player = game.players.find((candidate) => candidate.id === roll.playerId);

    return {
      playerId: roll.playerId,
      playerName: player?.name ?? "Unknown realm",
      playerColor: player?.color ?? "#8a5f18",
      total: roll.total
    };
  });

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  async function handleApplyRoll() {
    if (selectedTotal === null) {
      return;
    }

    const willCompleteRound = roundRolls.length + 1 >= game.players.length;
    const updatedGame = await recordDiceTotal(selectedTotal);
    setSelectedTotal(null);

    if (updatedGame?.activeWorldEvent && willCompleteRound) {
      void playEventSoundOnce(`${updatedGame.round}:${updatedGame.activeWorldEvent.id}`);
      router.push("/event");
      return;
    }

    router.push("/game");
  }

  if (game.setupStatus !== "in-progress") {
    return (
      <main className="hall grid min-h-dvh place-items-center px-4">
        <EmptyState
          icon={ScrollText}
          title="No active table"
          description="Start a game before rolling for the kingdom."
        />
      </main>
    );
  }

  return (
    <main className="hall min-h-dvh overflow-hidden px-4 py-5">
      <div className="mx-auto grid min-h-[calc(100dvh-2.5rem)] w-full max-w-md grid-rows-[auto_1fr] gap-5">
        <div className="flex items-center justify-between gap-3">
          <ActionButton
            icon={ArrowLeft}
            variant="ghost"
            size="sm"
            onClick={() => router.push("/game")}
          >
            Kingdom
          </ActionButton>
          <p className="font-display text-xs uppercase tracking-[0.32em] text-gold/80">Roll</p>
        </div>

        <section className="grid content-end gap-3">
          <DicePanel
            round={game.round}
            currentPlayer={currentTurnPlayer}
            selectedTotal={selectedTotal}
            diceTotals={diceTotals}
            roundRolls={roundRollSummaries}
            playerCount={game.players.length}
            onSelectTotal={setSelectedTotal}
            onApplyRoll={() => void handleApplyRoll()}
            canApply={selectedTotal !== null}
          />
          {error ? (
            <p className="px-1 font-body text-sm font-semibold text-ember">{error}</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
