"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Crown, ScrollText, ShieldAlert, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { getPlayerAvatar } from "@/lib/domain/avatars";
import { useGameStore } from "@/lib/state/gameStore";
import { cn } from "@/lib/ui/cn";

function getPlayerResourceCount(resources: Record<string, number>) {
  return Object.values(resources).reduce((sum, value) => sum + value, 0);
}

export function CrownSelectionScreen() {
  const router = useRouter();
  const { game, hydrate, crownSelectedKing, saveStatus, error } = useGameStore();
  const [resolvedKingId, setResolvedKingId] = useState<string | null>(null);
  const [hasTriggeredSelection, setHasTriggeredSelection] = useState(false);
  const [hasResolvedSelection, setHasResolvedSelection] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!game.isCrownSelectionPending) {
      return;
    }

    if (hasTriggeredSelection || saveStatus === "saving") {
      return;
    }

    setHasTriggeredSelection(true);

    void (async () => {
      const updatedGame = await crownSelectedKing();
      if (updatedGame?.kingPlayerId) {
        setResolvedKingId(updatedGame.kingPlayerId);
        setHasResolvedSelection(true);
      }
    })();
  }, [crownSelectedKing, game.isCrownSelectionPending, hasTriggeredSelection, saveStatus]);

  const crownedKingId = resolvedKingId ?? game.kingPlayerId;
  const crownedKing = useMemo(
    () => game.players.find((player) => player.id === crownedKingId),
    [crownedKingId, game.players]
  );
  const servedPlayers = new Set(game.playersWhoHaveBeenKing);
  const isSaving = saveStatus === "saving";
  const cycleProgressLabel = `${servedPlayers.size}/${game.players.length} crowned this cycle`;

  if (game.setupStatus !== "in-progress" || game.players.length === 0) {
    return (
      <section className="grid min-h-dvh place-items-center px-4 py-10">
        <EmptyState
          icon={ScrollText}
          title="No kingdom is ready"
          description="Start a game before choosing the next King."
        />
      </section>
    );
  }

  if (!game.isCrownSelectionPending && !hasResolvedSelection) {
    return (
      <section className="grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <EmptyState
            icon={Crown}
            title="The current crown still stands"
            description="Finish three full rounds before choosing a new ruler."
            action={
              <ActionButton onClick={() => router.push("/game")} icon={CheckCircle2}>
                Return to game
              </ActionButton>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="hall min-h-dvh overflow-x-hidden px-4 py-6">
      <div className="mx-auto grid w-full max-w-md gap-4">
        <ParchmentCard className="overflow-hidden p-5 shadow-glow">
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={16} aria-hidden="true" />
              <p className="font-display text-xs uppercase tracking-[0.34em]">Crown Selection</p>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight text-sepia">
                A New King Will Be Crowned
              </h1>
              <p className="mt-2 font-body text-sm leading-6 text-sepia/80">
                The kingdom gathers to choose its new ruler.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-gold/35 bg-[#e6d7b4]/55 px-3 py-2 font-body text-sm font-semibold text-sepia shadow-carved">
              <ShieldAlert size={16} className="text-gold" aria-hidden="true" />
              {isSaving
                ? "Choosing the next eligible ruler automatically."
                : "The next King was chosen from players who have not ruled this cycle."}
            </div>
            <div className="rounded-2xl border border-parchment-edge/60 bg-[#e6d7b4]/45 px-3 py-3 shadow-carved">
              <p className="font-display text-[0.62rem] uppercase tracking-[0.24em] text-sepia-muted">
                Crown Cycle
              </p>
              <p className="mt-1 font-body text-sm font-semibold text-sepia">{cycleProgressLabel}</p>
            </div>
          </div>
        </ParchmentCard>

        <div className="grid gap-3 sm:grid-cols-2">
          {game.players.map((player) => {
            const avatar = getPlayerAvatar(player.avatarId);
            const initial = player.name.trim().charAt(0).toUpperCase() || "?";
            const isCurrentKing = player.id === crownedKingId;
            const hasRuledThisCycle = servedPlayers.has(player.id);
            const totalResources = getPlayerResourceCount(player.resources);

            return (
              <ParchmentCard
                key={player.id}
                className={cn(
                  "h-full p-4 shadow-parchment",
                  isCurrentKing && "border-gold ring-2 ring-gold shadow-glow"
                )}
              >
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] bg-[#e6d7b4] font-display text-xl font-bold text-white shadow-carved"
                      style={{
                        borderColor: player.color,
                        backgroundColor: avatar ? undefined : player.color
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

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-display text-lg font-bold text-sepia">
                          {player.name}
                        </p>
                        {isCurrentKing ? (
                          <Crown
                            size={16}
                            className="shrink-0 text-gold"
                            fill="#c8942c"
                            aria-label="King"
                          />
                        ) : null}
                      </div>
                      <p className="font-body text-xs uppercase tracking-[0.22em] text-sepia-muted">
                        {isCurrentKing
                          ? "New King"
                          : hasRuledThisCycle
                            ? "Already ruled"
                            : "Still eligible"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-parchment-edge/60 bg-[#e6d7b4]/45 px-3 py-2 shadow-carved">
                      <p className="font-display text-[0.62rem] uppercase tracking-[0.24em] text-sepia-muted">
                        Victory Points
                      </p>
                      <p className="font-display text-2xl font-bold text-sepia">
                        {player.victoryPoints}
                      </p>
                    </div>
                    <div className="rounded-xl border border-parchment-edge/60 bg-[#e6d7b4]/45 px-3 py-2 shadow-carved">
                      <p className="font-display text-[0.62rem] uppercase tracking-[0.24em] text-sepia-muted">
                        Resources
                      </p>
                      <p className="font-display text-2xl font-bold text-sepia">
                        {totalResources}
                      </p>
                    </div>
                  </div>
                </div>
              </ParchmentCard>
            );
          })}
        </div>

        {error ? (
          <p className="rounded-2xl border border-ember/50 bg-ember/10 p-3 font-body text-sm font-bold text-sepia">
            {error}
          </p>
        ) : null}

        <ActionButton
          icon={Crown}
          onClick={() => router.push("/game")}
          disabled={isSaving || !crownedKing}
          loading={isSaving}
          fullWidth
          className="shadow-glow"
        >
          {isSaving ? "Crowning..." : "Continue"}
        </ActionButton>
      </div>
    </section>
  );
}
