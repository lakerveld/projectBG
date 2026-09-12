"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  rewardResources,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";

const artwork: Record<RewardResource, string> = {
  Bier: "bier",
  Salmiak: "salmiak",
  Poedersuiker: "poedersuiker",
  Eten: "eten"
};

export function RewardReveal({
  resource,
  inventory,
  roll,
  onContinue
}: {
  resource: RewardResource;
  inventory: JourneyInventory;
  roll: number;
  onContinue: () => void;
}) {
  const total = Object.values(inventory).reduce((sum, value) => sum + value, 0);
  const [displayTotal, setDisplayTotal] = useState(total - 1);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDisplayTotal(total),
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 650
    );
    return () => window.clearTimeout(timer);
  }, [total]);

  return (
    <section
      lang="nl"
      className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-5 px-5 py-7"
    >
      <div className="overflow-hidden rounded-3xl border border-gold/60 bg-night-deep shadow-glow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={`/rewards/${artwork[resource]}.png`}
            alt={
              resource === "Salmiak"
                ? "Psychedelische illustratie van een fles Salamari"
                : `Psychedelische illustratie van ${resource.toLowerCase()}`
            }
            fill
            sizes="(max-width: 512px) 100vw, 472px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent" />
          <p className="absolute left-5 top-5 rounded-full border border-gold/50 bg-night-deep/80 px-4 py-2 font-display text-sm text-parchment">
            {roll} ogen gegooid
          </p>
          <div className="absolute inset-x-5 bottom-2 text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-gold-bright">
              Resource verdiend
            </p>
            <h1
              tabIndex={-1}
              ref={focusHeading}
              className="reward-pop mt-2 font-display text-4xl font-bold text-parchment outline-none"
            >
              +1 {resource}
            </h1>
          </div>
        </div>
        <div className="space-y-5 p-5 text-center">
          <p className="font-body text-parchment/80">Matthew, je voorraad groeit!</p>
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
            <p className="font-display text-xs uppercase tracking-widest text-gold-bright">
              Totale score
            </p>
            <p
              key={displayTotal}
              aria-hidden="true"
              className="reward-pop mt-2 font-display text-5xl font-bold text-parchment"
            >
              {displayTotal}
            </p>
            <p role="status" className="sr-only">
              Je krijgt 1 {resource}. Totale score: {total} resources.
            </p>
            <p className="mt-2 font-body text-sm text-parchment/70">
              {total - 1} + 1 = {total} resources
            </p>
          </div>
          <ul aria-label="Nieuwe voorraad" className="grid grid-cols-2 gap-2">
            {rewardResources.map((name) => (
              <li
                key={name}
                className={`rounded-xl border p-2 font-body text-sm ${name === resource ? "border-gold bg-gold/15 text-gold-bright" : "border-parchment/15 text-parchment/75"}`}
              >
                {name} <strong>{inventory[name]}</strong>
                {name === resource && <span> (+1)</span>}
              </li>
            ))}
          </ul>
          <ActionButton fullWidth size="lg" onClick={onContinue}>
            Verder naar de kaart
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}
