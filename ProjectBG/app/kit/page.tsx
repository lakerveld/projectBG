"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  Dices,
  Scale,
  ScrollText,
  Sparkles,
  Swords
} from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { DiceRollResult } from "@/components/ui/DiceRollResult";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventHistory } from "@/components/ui/EventHistory";
import { Modal } from "@/components/ui/Modal";
import { PlayerSummary } from "@/components/ui/PlayerSummary";
import { ResourceTracker, type ResourceLine } from "@/components/ui/ResourceTracker";
import { WorldEventCard } from "@/components/ui/WorldEventCard";
import { DEFAULT_RESOURCES } from "@/lib/domain/defaults";
import { MVP_WORLD_EVENTS } from "@/lib/domain/events";
import { sampleGame } from "@/lib/domain/sampleGame";
import type { EntityId, HistoryEntry } from "@/lib/domain/types";

const HISTORY: HistoryEntry[] = [
  {
    id: "h5",
    type: "world_event.applied",
    message: "Heavy Storms swept the realms. All harvests falter this round.",
    createdAt: "2026-07-02T14:32:00.000Z"
  },
  {
    id: "h4",
    type: "dice.recorded",
    message: "South cast the bones and read a 5.",
    createdAt: "2026-07-02T14:30:00.000Z"
  },
  {
    id: "h3",
    type: "resource.adjusted",
    message: "North's treasury gained 2 Grain.",
    createdAt: "2026-07-02T14:28:00.000Z"
  },
  {
    id: "h2",
    type: "game.started",
    message: "The game began. North was crowned and takes the first turn.",
    createdAt: "2026-07-02T14:20:00.000Z"
  },
  {
    id: "h1",
    type: "game.created",
    message: "Demo Table was raised.",
    createdAt: "2026-07-02T14:18:00.000Z"
  }
];

const king = sampleGame.players[0];
const rival = sampleGame.players[1];

export default function KitPage() {
  const [ledger, setLedger] = useState<Record<EntityId, number>>({ ...king.resources });
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRealm, setActiveRealm] = useState<EntityId>(king.id);

  const resourceLines: ResourceLine[] = useMemo(
    () =>
      DEFAULT_RESOURCES.map((definition) => ({
        definition,
        quantity: ledger[definition.id] ?? 0
      })),
    [ledger]
  );

  const adjust = (resourceId: EntityId, delta: number) =>
    setLedger((prev) => ({
      ...prev,
      [resourceId]: Math.max(0, (prev[resourceId] ?? 0) + delta)
    }));

  return (
    <main className="hall min-h-dvh overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 pb-16 pt-6">
        {/* Header */}
        <header>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-body text-sm text-parchment/70 transition hover:text-parchment"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to hall
          </Link>
          <p className="mt-5 font-display text-xs uppercase tracking-[0.4em] text-gold">
            Component Grimoire
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold leading-none text-parchment">
            The Chronicle
          </h1>
          <div className="mt-3 flex items-center gap-2" aria-hidden="true">
            <span className="h-px w-10 bg-gradient-to-r from-gold to-transparent" />
            <Sparkles size={13} className="text-gold" />
            <span className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
          </div>
          <p className="mt-3 max-w-sm font-body text-sm leading-6 text-parchment/70">
            A reusable dark-fantasy component set for the shared-table companion. Parchment on
            candle-lit stone, sealed in gold.
          </p>
        </header>

        <Section eyebrow="The signature" title="World event">
          <WorldEventCard event={MVP_WORLD_EVENTS.negative_world} round={3} />
        </Section>

        <Section eyebrow="Reading the bones" title="Dice roll result">
          <div className="grid gap-3">
            <DiceRollResult total={11} label="North's cast" caption="A generous throw" />
            <DiceRollResult total={7} label="Round average" caption="4 of 4 realms have rolled" />
            <DiceRollResult total={4} label="South's cast" caption="The dice turn cold" />
          </div>
        </Section>

        <Section eyebrow="The treasury" title="Resource tracker">
          <ResourceTracker title="North · Royal treasury" resources={resourceLines} onAdjust={adjust} />
        </Section>

        <Section eyebrow="The realms" title="Player summary">
          <div className="grid gap-3">
            <PlayerSummary
              player={king}
              resources={DEFAULT_RESOURCES}
              isKing
              turnActive={activeRealm === king.id}
              onSelect={() => setActiveRealm(king.id)}
            />
            <PlayerSummary
              player={rival}
              resources={DEFAULT_RESOURCES}
              turnActive={activeRealm === rival.id}
              onSelect={() => setActiveRealm(rival.id)}
            />
          </div>
        </Section>

        <Section eyebrow="Deeds recorded" title="Event history">
          <EventHistory entries={HISTORY} />
        </Section>

        <Section eyebrow="Commands" title="Action button">
          <div className="grid gap-3">
            <ActionButton icon={Dices} iconRight={ArrowRight} fullWidth>
              Cast the bones
            </ActionButton>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton variant="iron" icon={Coins}>
                Trade
              </ActionButton>
              <ActionButton variant="ember" icon={Swords}>
                Wage war
              </ActionButton>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton size="sm" variant="ghost">
                Skip turn
              </ActionButton>
              <ActionButton size="sm" variant="iron">
                Small
              </ActionButton>
              <ActionButton size="sm" loading>
                Sealing
              </ActionButton>
            </div>
          </div>
        </Section>

        <Section eyebrow="Decisions" title="Modal / dialog">
          <ActionButton variant="iron" icon={Scale} onClick={() => setModalOpen(true)}>
            Convene the council
          </ActionButton>
        </Section>

        <Section eyebrow="Nothing yet" title="Empty state">
          <EmptyState
            icon={ScrollText}
            title="No decrees have been read"
            description="When the realms finish casting, the world's verdict will be proclaimed here."
            action={<ActionButton icon={Dices}>Begin the round</ActionButton>}
          />
        </Section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={Scale}
        tone="arcane"
        title="Convene the council?"
        description="Calling the council pauses the round while the realms deliberate. All pending casts are held until the council is dismissed."
        footer={
          <>
            <ActionButton variant="ghost" onClick={() => setModalOpen(false)}>
              Dismiss
            </ActionButton>
            <ActionButton icon={Scale} onClick={() => setModalOpen(false)}>
              Convene
            </ActionButton>
          </>
        }
      >
        <p className="rounded-xl border border-parchment-edge/60 bg-[#e6d7b4]/50 px-3.5 py-3 font-body text-sm leading-6 text-sepia/90">
          This is body content within the scroll. Any council business — trades, alliances, or
          decrees — can be composed here.
        </p>
      </Modal>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3.5">
      <div>
        <p className="font-display text-[0.7rem] uppercase tracking-[0.3em] text-gold/80">
          {eyebrow}
        </p>
        <h2 className="font-display text-xl font-bold text-parchment">{title}</h2>
      </div>
      {children}
    </section>
  );
}
