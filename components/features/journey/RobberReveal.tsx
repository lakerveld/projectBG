"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Wheat, Snowflake, TestTube, Dice5, ShieldAlert, ArrowRight } from "lucide-react";
import { ResourceInventory } from "./ResourceInventory";
import styles from "./ResourceReveal.module.css";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  rewardResources,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";

const icons = { Gerst: Wheat, Salmari: TestTube, Sneeuw: Snowflake };
const colors = {
  Gerst: "bg-gold",
  Salmari: "bg-[#c681f5]",
  Sneeuw: "bg-[#ff91c4]"
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
  const stop = rewardResources.length * 11 + (resource ? rewardResources.indexOf(resource) : 0);
  const reel = Array.from(
    { length: stop + 2 },
    (_, index) => rewardResources[index % rewardResources.length]
  );
  return (
    <section
      lang="nl"
      className={styles.scene}
      style={{ "--reward-accent": "#ff91c4" } as CSSProperties}
    >
      <Image
        src="/rewards/struikrover.png"
        alt="Monsterrat in een paarse roversmantel, met zwart oogmasker en een zak buit"
        fill
        priority
        sizes="(max-width: 640px) 100vw, 640px"
        className={styles.art}
      />
      <div className={styles.shade} aria-hidden="true" />
      <header className={styles.header}>
        <span className={styles.badge}>
          <Dice5 size={18} aria-hidden="true" />7 OGEN — PECH!
        </span>
        <span className={styles.badge}>
          <ShieldAlert size={18} aria-hidden="true" />
          OVERVAL
        </span>
      </header>
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Je bent overvallen</p>
        <h1
          ref={focusHeading}
          tabIndex={-1}
          className={`font-display ${styles.title}`}
          style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)" }}
        >
          De struikrover!
        </h1>
        {resource && (
          <div className={styles.reel} aria-hidden="true">
            <p className="bg-[#100b24] py-2 text-xs font-bold uppercase tracking-widest text-parchment">
              {settled ? "Dit is de buit" : "Wat pikt de rover?"}
            </p>
            <div className="relative h-24 overflow-hidden bg-panel">
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
              <p className="reward-pop text-3xl font-bold text-[#ff91c4]">−1 {resource}</p>
              <p className="mt-1 text-sm">
                Geef 1 {resource.toLowerCase()} aan de rover. Je hebt er nog {inventory[resource]}.
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
        {settled && <ResourceInventory inventory={inventory} resource={resource} delta="−1" />}
        {storageError && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-[#ff91c4]/40 bg-[#100b24]/90 p-3 text-sm text-[#ffb9d9]"
          >
            Je voorraad is alleen voor deze sessie aangepast. Lokale opslag is niet beschikbaar.
          </p>
        )}
        <ActionButton
          className="mt-3"
          fullWidth
          size="lg"
          iconRight={ArrowRight}
          disabled={!settled}
          onClick={onContinue}
        >
          Naar de map
        </ActionButton>
      </div>
    </section>
  );
}
