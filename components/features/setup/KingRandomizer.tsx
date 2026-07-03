"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, ScrollText } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { PlayerSummary } from "@/components/ui/PlayerSummary";
import { MIN_PLAYERS } from "@/lib/domain/defaults";
import { useGameStore } from "@/lib/state/gameStore";

export function KingRandomizer() {
  const router = useRouter();
  const { game, hydrate, saveStatus, error, startLocalGame } = useGameStore();
  const [isSelectingKing, setIsSelectingKing] = useState(false);
  const [selectionPreviewName, setSelectionPreviewName] = useState<string | null>(null);

  const king = game.players.find((player) => player.id === game.kingPlayerId);
  const canSelectKing = game.players.length >= MIN_PLAYERS && game.setupStatus !== "in-progress";

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  async function handleSelectKing() {
    if (!canSelectKing || isSelectingKing) {
      return;
    }

    setIsSelectingKing(true);
    setSelectionPreviewName(game.players[0]?.name ?? null);

    let previewIndex = 0;
    const intervalId = window.setInterval(() => {
      const previewPlayer = game.players[previewIndex % game.players.length];
      setSelectionPreviewName(previewPlayer?.name ?? null);
      previewIndex += 1;
    }, 120);

    window.setTimeout(async () => {
      window.clearInterval(intervalId);
      const startedGame = await startLocalGame();
      setIsSelectingKing(false);

      if (startedGame) {
        const selectedKing = startedGame.players.find(
          (player) => player.id === startedGame.kingPlayerId
        );
        setSelectionPreviewName(selectedKing?.name ?? null);
      }
    }, 1400);
  }

  if (game.players.length < MIN_PLAYERS) {
    return (
      <EmptyState
        icon={ScrollText}
        title="No table is ready"
        description="Create a game and add players before crowning the first King."
      />
    );
  }

  return (
    <section className="grid gap-4">
      <ParchmentCard className="p-4">
        <div className="grid gap-3">
          <div>
            <p className="font-display text-base font-bold uppercase tracking-wide text-sepia">
              Review the table
            </p>
            <p className="mt-1 font-body text-sm leading-6 text-sepia/75">
              Confirm the players, then let the app crown the King for round one.
            </p>
          </div>

          <ul className="grid gap-2">
            {game.players.map((player) => (
              <li key={player.id}>
                <PlayerSummary
                  player={player}
                  isKing={player.id === game.kingPlayerId}
                  turnActive={player.id === game.currentTurnPlayerId}
                />
              </li>
            ))}
          </ul>
        </div>
      </ParchmentCard>

      <ParchmentCard variant="raised" className="p-4">
        <div className="grid gap-3">
          <p className="font-display text-base font-bold uppercase tracking-wide text-sepia">
            Crown the King
          </p>

          <div className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-gold bg-[#e6d7b4]/50 px-3 text-center font-display text-base font-bold text-sepia shadow-carved">
            <Crown size={20} className="text-gold" fill="#c8942c" aria-hidden="true" />
            {king
              ? `${king.name} is King`
              : selectionPreviewName
                ? `Selecting ${selectionPreviewName}`
                : "The crown awaits"}
          </div>

          {error ? (
            <p className="rounded-xl border border-ember/50 bg-ember/10 p-3 font-body text-sm font-bold text-sepia">
              {error}
            </p>
          ) : null}

          {game.setupStatus === "in-progress" ? (
            <ActionButton icon={Crown} onClick={() => router.push("/game")} fullWidth>
              Continue to game
            </ActionButton>
          ) : (
            <ActionButton
              disabled={!canSelectKing || saveStatus === "loading"}
              icon={Crown}
              loading={isSelectingKing}
              onClick={() => void handleSelectKing()}
              fullWidth
            >
              {isSelectingKing ? "Selecting King..." : "Select King"}
            </ActionButton>
          )}
        </div>
      </ParchmentCard>
    </section>
  );
}
