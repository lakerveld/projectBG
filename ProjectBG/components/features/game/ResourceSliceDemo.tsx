"use client";

import { useEffect, useState } from "react";
import { Crown, Dice5, Minus, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { useGameStore } from "@/lib/state/gameStore";

export function ResourceSliceDemo() {
  const { game, saveStatus, error, hydrate, adjustPlayerResource, recordDiceTotal } =
    useGameStore();
  const king = game.players.find((player) => player.id === game.kingPlayerId);
  const currentTurnPlayer = game.players.find((player) => player.id === game.currentTurnPlayerId);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const diceTotals = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const roundRolls = game.currentRoundRolls ?? [];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <section className="grid gap-4">
      <Panel title={game.name}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">Local persistence</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 font-semibold text-ink">
            <Save size={15} aria-hidden="true" />
            {saveStatus}
          </span>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
        {king ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold bg-bg p-3 text-sm font-black text-ink">
            <Crown size={18} className="text-gold" aria-hidden="true" />
            {king.name} is King and takes the first turn
          </div>
        ) : null}
      </Panel>

      {game.setupStatus === "in-progress" ? (
        <Panel title="Round 1 dice">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg p-3 text-sm">
              <span className="font-semibold text-muted">Current turn</span>
              <span className="font-black text-ink">{currentTurnPlayer?.name ?? "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg p-3 text-sm">
              <span className="font-semibold text-muted">Round progress</span>
              <span className="font-black text-ink">
                {roundRolls.length}/{game.players.length} rolls
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {diceTotals.map((total) => (
                <button
                  className={`grid min-h-11 place-items-center rounded-lg border text-sm font-black ${
                    selectedTotal === total
                      ? "border-forest bg-forest text-white"
                      : "border-line bg-bg text-ink"
                  }`}
                  key={total}
                  onClick={() => setSelectedTotal(total)}
                  type="button"
                >
                  {total}
                </button>
              ))}
            </div>
            <Button
              className="min-h-12"
              disabled={selectedTotal === null}
              onClick={() => {
                if (selectedTotal !== null) {
                  void recordDiceTotal(selectedTotal);
                  setSelectedTotal(null);
                }
              }}
              type="button"
            >
              <Dice5 size={18} aria-hidden="true" />
              Record dice total
            </Button>
            <p className="rounded-lg border border-line bg-bg p-3 text-sm leading-6 text-muted">
              Each player rolls once. When everyone has rolled, the app calculates the round average
              and applies one global world event. Resource production and momentum are deferred.
            </p>
          </div>
        </Panel>
      ) : null}

      {game.activeWorldEvent ? (
        <Panel title="World event">
          <div className="grid gap-2 rounded-lg border border-line bg-bg p-3">
            <p className="text-base font-black text-ink">{game.activeWorldEvent.name}</p>
            <p className="text-sm leading-6 text-muted">{game.activeWorldEvent.description}</p>
            <p className="text-xs font-bold uppercase text-forest">
              {game.activeWorldEvent.category.replace("_", " ")}
            </p>
          </div>
        </Panel>
      ) : null}

      {game.players.map((player) => (
        <Panel key={player.id} title={player.name}>
          {player.id === game.kingPlayerId ? (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-gold bg-bg p-3 text-sm font-black text-ink">
              <Crown size={18} className="text-gold" aria-hidden="true" />
              King's capital
            </div>
          ) : null}
          <div className="grid gap-3">
            {game.resources.map((resource) => {
              const quantity = player.resources[resource.id] ?? 0;

              return (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-line bg-bg p-3"
                  key={resource.id}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: resource.color }}
                        aria-hidden="true"
                      />
                      <p className="truncate text-sm font-black text-ink">{resource.name}</p>
                    </div>
                    <p className="text-xs font-semibold text-muted">{resource.shortLabel}</p>
                  </div>

                  <div className="grid grid-cols-[44px_48px_44px] items-center gap-2">
                    <Button
                      aria-label={`Remove ${resource.name} from ${player.name}`}
                      className="min-h-11 px-0"
                      disabled={quantity === 0}
                      onClick={() => void adjustPlayerResource(player.id, resource.id, -1)}
                      variant="secondary"
                    >
                      <Minus size={18} aria-hidden="true" />
                    </Button>
                    <span className="text-center text-lg font-black tabular-nums">{quantity}</span>
                    <Button
                      aria-label={`Add ${resource.name} to ${player.name}`}
                      className="min-h-11 px-0"
                      onClick={() => void adjustPlayerResource(player.id, resource.id, 1)}
                      variant="secondary"
                    >
                      <Plus size={18} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      ))}

      <Panel title="Recent history">
        <ul className="grid gap-2">
          {game.history.slice(0, 5).map((entry) => (
            <li className="rounded-lg border border-line bg-bg p-3 text-sm" key={entry.id}>
              <p className="font-semibold text-ink">{entry.message}</p>
              <time className="text-xs text-muted" dateTime={entry.createdAt}>
                {new Date(entry.createdAt).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}
