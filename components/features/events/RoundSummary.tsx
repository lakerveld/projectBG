"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Dices, ScrollText, Sigma } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { cn } from "@/lib/ui/cn";
import { useGameStore } from "@/lib/state/gameStore";
import type { HistoryEntry } from "@/lib/domain/types";

const SUMMARY_DELAY_MS = 5200;

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getLatestEventEntry(entries: HistoryEntry[], eventId?: string) {
  return entries.find(
    (entry) =>
      entry.type === "world_event.applied" && (!eventId || entry.metadata?.eventId === eventId)
  );
}

export function RoundSummary() {
  const router = useRouter();
  const { game, hydrate } = useGameStore();
  const [isOpeningEvent, setIsOpeningEvent] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const eventEntry = useMemo(
    () => getLatestEventEntry(game.history, game.activeWorldEvent?.id),
    [game.activeWorldEvent?.id, game.history]
  );
  const rolls = useMemo(() => readNumberArray(eventEntry?.metadata?.rolls), [eventEntry]);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  const average = readNumber(eventEntry?.metadata?.averageRoll);

  useEffect(() => {
    if (!game.activeWorldEvent || rolls.length === 0) {
      return;
    }

    let eventTimer: number | undefined;
    const summaryTimer = window.setTimeout(() => {
      setIsOpeningEvent(true);
      eventTimer = window.setTimeout(() => router.push("/event"), 650);
    }, SUMMARY_DELAY_MS);

    return () => {
      window.clearTimeout(summaryTimer);
      if (eventTimer) {
        window.clearTimeout(eventTimer);
      }
    };
  }, [game.activeWorldEvent, rolls.length, router]);

  if (!game.activeWorldEvent || rolls.length === 0) {
    return (
      <section className="flex min-h-dvh flex-col justify-center gap-5 px-4 py-10">
        <EmptyState
          icon={ScrollText}
          title="No round summary"
          description="Finish a full round of dice rolls to reveal the next world event."
        />
        <ActionButton iconRight={ArrowRight} onClick={() => router.push("/game")} fullWidth>
          Back to game
        </ActionButton>
      </section>
    );
  }

  const averageLabel = average === null ? "-" : average.toFixed(average % 1 === 0 ? 0 : 1);

  return (
    <section
      className={cn(
        "round-summary-stage relative min-h-dvh overflow-hidden px-4 py-6",
        isOpeningEvent && "round-summary-stage-open"
      )}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_28%,rgba(232,191,106,0.18),transparent_34%),linear-gradient(180deg,rgba(20,16,10,0.1),rgba(8,7,5,0.82))]" />

      <div className="relative z-[1] mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col justify-center gap-4">
        <div className="text-center">
          <p className="font-display text-xs uppercase tracking-[0.34em] text-gold/85">
            Round complete
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-parchment">
            The dice have spoken
          </h1>
        </div>

        <ParchmentCard className="round-summary-card overflow-hidden p-4 shadow-glow">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-2xl border border-parchment-edge/60 bg-[#e6d7b4]/45 p-3 text-center shadow-carved">
              <Sigma className="mx-auto text-sepia-muted" size={18} aria-hidden="true" />
              <p className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.24em] text-sepia-muted">
                Total
              </p>
              <p className="font-display text-3xl font-bold tabular-nums text-sepia">{total}</p>
            </div>

            <div className="grid size-16 place-items-center rounded-full border border-gold/45 bg-night/90 text-gold shadow-seal">
              <Dices size={28} strokeWidth={2.3} aria-hidden="true" />
            </div>

            <div className="rounded-2xl border border-parchment-edge/60 bg-[#e6d7b4]/45 p-3 text-center shadow-carved">
              <ScrollText className="mx-auto text-sepia-muted" size={18} aria-hidden="true" />
              <p className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.24em] text-sepia-muted">
                Average
              </p>
              <p className="font-display text-3xl font-bold tabular-nums text-sepia">
                {averageLabel}
              </p>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-4 gap-2" aria-label="Completed dice rolls">
            {rolls.map((roll, index) => (
              <li
                key={`${roll}-${index}`}
                className="round-summary-die grid aspect-square place-items-center rounded-xl border border-parchment-edge bg-[#f2e6ca] font-display text-2xl font-bold text-sepia shadow-carved"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {roll}
              </li>
            ))}
          </ul>

          <div className="round-summary-loader mt-5 rounded-2xl border border-gold/35 bg-night/90 p-4 text-center">
            <div className="catan-loader mx-auto" aria-hidden="true">
              <span className="catan-hex catan-hex-grain" />
              <span className="catan-hex catan-hex-forest" />
              <span className="catan-hex catan-hex-brick" />
              <span className="catan-hex catan-hex-sheep" />
              <span className="catan-hex catan-hex-ore" />
              <span className="catan-road catan-road-one" />
              <span className="catan-road catan-road-two" />
              <span className="catan-settlement" />
            </div>
            <p className="mt-4 font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold">
              Reading the island
            </p>
            <p className="mt-1 font-body text-sm font-semibold text-parchment/78">
              Preparing the next world event...
            </p>
          </div>
        </ParchmentCard>
      </div>
    </section>
  );
}
