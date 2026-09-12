"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Beer, Candy, Utensils, Wheat } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  rewardResources,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";

const icons = { Bier: Beer, Salmiak: Candy, Poedersuiker: Wheat, Eten: Utensils };
const colors = {
  Bier: "bg-gold",
  Salmiak: "bg-[#c681f5]",
  Poedersuiker: "bg-[#ff91c4]",
  Eten: "bg-[#a9dec5]"
};
const SPIN_MS = 3600;

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus({ preventScroll: true });
}

export function RobberReveal({
  resource,
  inventory,
  storageError,
  onContinue
}: {
  resource: RewardResource | null;
  inventory: JourneyInventory;
  storageError: boolean;
  onContinue: () => void;
}) {
  const [settled, setSettled] = useState(resource === null);
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setSettled(true), reduced ? 0 : SPIN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // The outcome is committed by the roll handler, never by animation events or effects.
  const stop = 32 + (resource ? rewardResources.indexOf(resource) : 0);
  const reel = Array.from({ length: stop + 2 }, (_, index) => rewardResources[index % 4]);
  return (
    <section
      lang="nl"
      className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-6"
    >
      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-parchment text-ink shadow-parchment">
        <div className="relative aspect-[6/5] border-b-2 border-ink">
          <Image
            src="/rewards/struikrover.png"
            alt="Monsterrat in een paarse roversmantel, met zwart oogmasker en een zak buit"
            fill
            priority
            sizes="(max-width: 512px) 100vw, 480px"
            className="object-cover object-top"
          />
          <span className="absolute left-4 top-4 rotate-[-4deg] rounded-sm border-2 border-ink bg-gold px-3 py-2 font-bold shadow-seal">
            7 OGEN — PECH!
          </span>
        </div>
        <div className="space-y-4 p-5 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ember">
              Je bent overvallen
            </p>
            <h1
              ref={focusHeading}
              tabIndex={-1}
              className="mt-1 font-display text-3xl font-bold outline-none"
            >
              De struikrover!
            </h1>
            <p className="mt-2 text-sm text-sepia-muted">
              Matthew, één van ons pikt een resource uit je voorraad.
            </p>
          </div>
          {resource && (
            <div
              className="rounded-xl border-2 border-ink bg-arcane p-3 shadow-seal"
              aria-hidden="true"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white">
                {settled ? "Dit is de buit" : "Wat pikt de rover?"}
              </p>
              <div className="relative h-24 overflow-hidden rounded-lg border-2 border-ink bg-panel">
                <div
                  className="robber-reel"
                  style={{ "--reel-stop": `-${stop * 6}rem` } as CSSProperties}
                >
                  {reel.map((name, index) => {
                    const Icon = icons[name];
                    return (
                      <div
                        key={index}
                        className={`flex h-24 items-center justify-center gap-3 ${colors[name]}`}
                      >
                        <Icon size={32} strokeWidth={2.5} />
                        <span className="text-xl font-bold">{name}</span>
                      </div>
                    );
                  })}
                </div>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xl">▸</span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xl">◂</span>
              </div>
            </div>
          )}
          <div role="status" aria-live="polite" aria-atomic="true" className="min-h-16">
            {!settled ? (
              <p className="py-3 font-bold">De automaat draait…</p>
            ) : resource ? (
              <>
                <p className="reward-pop text-3xl font-bold text-ember">−1 {resource}</p>
                <p className="mt-1 text-sm">
                  Geef 1 {resource.toLowerCase()} aan de rover. Je hebt er nog {inventory[resource]}
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold">Niets te halen!</p>
                <p className="mt-1 text-sm">
                  Je voorraad is leeg. De rover vertrekt met lege handen.
                </p>
              </>
            )}
          </div>
          {settled && (
            <ul aria-label="Nieuwe voorraad" className="grid grid-cols-2 gap-2">
              {rewardResources.map((name) => (
                <li
                  key={name}
                  className={`rounded-lg border-2 border-ink p-2 text-sm ${name === resource ? "bg-[#ff91c4] font-bold" : "bg-panel"}`}
                >
                  {name}: {inventory[name]}
                  {name === resource && " (−1)"}
                </li>
              ))}
            </ul>
          )}
          {storageError && (
            <p role="alert" className="text-sm text-ember">
              Je voorraad is alleen voor deze sessie aangepast. Lokale opslag is niet beschikbaar.
            </p>
          )}
          <ActionButton fullWidth size="lg" disabled={!settled} onClick={onContinue}>
            Verder naar de quiz
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
