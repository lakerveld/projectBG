"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ScrollText } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventParticleOverlay, type EventParticleType } from "@/components/ui/EventParticleOverlay";
import { useGameStore } from "@/lib/state/gameStore";
import type { WorldEventCategory } from "@/lib/domain/types";
import { getWorldEventRevealVisual } from "@/lib/ui/worldEventRevealVisuals";
import { useEventSound } from "@/lib/ui/useEventSound";

const PARTICLE_TYPE_BY_CATEGORY: Record<WorldEventCategory, EventParticleType> = {
  positive_world: "positive",
  neutral_world: "neutral",
  negative_world: "negative"
};

const EVENT_ACCENT_BY_CATEGORY: Record<
  WorldEventCategory,
  {
    border: string;
    buttonBorder: string;
    buttonBackground: string;
    buttonText: string;
    chipBorder: string;
    chipBackground: string;
    chipText: string;
    chipLabel: string;
  }
> = {
  positive_world: {
    border: "border-[#176b4d]/70",
    buttonBorder: "border-[#176b4d]/80",
    buttonBackground: "bg-[#0f2f23]/92",
    buttonText: "text-[#dbf4df]",
    chipBorder: "border-[#176b4d]/55",
    chipBackground: "bg-[#10281f]/92",
    chipText: "text-[#dbf4df]",
    chipLabel: "Bonus"
  },
  neutral_world: {
    border: "border-[#176b4d]/70",
    buttonBorder: "border-[#176b4d]/80",
    buttonBackground: "bg-[#0f2f23]/92",
    buttonText: "text-[#dbf4df]",
    chipBorder: "border-[#176b4d]/55",
    chipBackground: "bg-[#10281f]/92",
    chipText: "text-[#dbf4df]",
    chipLabel: "Neutral"
  },
  negative_world: {
    border: "border-[#b4472f]/75",
    buttonBorder: "border-[#b4472f]/85",
    buttonBackground: "bg-[#31130d]/94",
    buttonText: "text-[#ffe4df]",
    chipBorder: "border-[#b4472f]/55",
    chipBackground: "bg-[#2e120d]/94",
    chipText: "text-[#ffe4df]",
    chipLabel: "Penalty"
  }
};

export function EventReveal() {
  const router = useRouter();
  const { game, hydrate } = useGameStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEventSound(game.activeWorldEvent ? `${game.round}:${game.activeWorldEvent.id}` : null);

  if (!game.activeWorldEvent) {
    return (
      <section className="flex min-h-dvh flex-col justify-center gap-5 px-4 py-10">
        <EmptyState
          icon={ScrollText}
          title="No world event"
          description="Finish a full round of dice rolls to reveal the next world event."
        />
        <ActionButton iconRight={ArrowRight} onClick={() => router.push("/game")} fullWidth>
          Back to game
        </ActionButton>
      </section>
    );
  }

  const visual = getWorldEventRevealVisual(game.activeWorldEvent);
  const particleType = PARTICLE_TYPE_BY_CATEGORY[game.activeWorldEvent.category];
  const accent = EVENT_ACCENT_BY_CATEGORY[game.activeWorldEvent.category];

  return (
    <section className="relative min-h-dvh overflow-hidden">
      <div className="event-bg-zoom absolute inset-0 z-0">
        <Image
          src={visual.imageSrc}
          alt={visual.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-night/30 via-night/35 to-night/95" />
      <EventParticleOverlay type={particleType} intensity="high" className="z-[2]" />

      <div className="relative z-[3] mx-auto flex min-h-dvh w-full max-w-md flex-col justify-end gap-4 px-4 pb-6 pt-10">
        <div
          className={`rounded-3xl border ${accent.border} bg-night-deep/95 p-5 shadow-glow backdrop-blur-sm`}
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-gold">
            {visual.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-parchment">
            {game.activeWorldEvent.name}
          </h1>
          <p className="mt-3 font-body text-base leading-7 text-parchment/85">
            {game.activeWorldEvent.description}
          </p>
          <ul className="mt-4 grid gap-2">
            {game.activeWorldEvent.effectsApplied.map((effect) => (
              <li
                key={effect}
                className={`rounded-2xl border px-3 py-2 font-body text-sm leading-6 shadow-carved ${accent.chipBorder} ${accent.chipBackground} ${accent.chipText}`}
              >
                <span className="mb-1 inline-flex rounded-full border border-current/35 bg-black/15 px-2.5 py-0.5 font-display text-[0.68rem] font-bold uppercase tracking-[0.2em]">
                  {accent.chipLabel}
                </span>
                <span className="block text-[0.92rem] leading-6 text-current/95">{effect}</span>
              </li>
            ))}
          </ul>
        </div>

        <ActionButton
          iconRight={ArrowRight}
          onClick={() => router.push("/game")}
          fullWidth
          variant="iron"
          className={`border ${accent.buttonBorder} ${accent.buttonBackground} ${accent.buttonText}`}
        >
          Continue
        </ActionButton>
      </div>
    </section>
  );
}
