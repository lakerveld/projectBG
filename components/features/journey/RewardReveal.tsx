"use client";

import Image from "next/image";
import { Dice5, Sparkles, ArrowRight, Repeat2 } from "lucide-react";
import type { CSSProperties } from "react";
import { ResourceInventory } from "./ResourceInventory";
import styles from "./ResourceReveal.module.css";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  resourceExchangeLabels,
  type JourneyInventory,
  type RewardResource
} from "@/lib/domain/journeyRewards";

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
  const artwork = {
    Gerst: {
      src: "/rewards/gerst-psychedelic.png",
      alt: "Psychedelische illustratie van gouden gerstaren"
    },
    Salmari: {
      src: "/rewards/salmari-psychedelic.png",
      alt: "Psychedelische illustratie van een donkere Salmari-fles en een shotglas"
    },
    Sneeuw: {
      src: "/rewards/sneeuwpoeder-psychedelic.png",
      alt: "Psychedelische illustratie van een gouden schaal met wit sneeuwpoeder"
    }
  }[resource];

  const accent = { Gerst: "#dfff00", Salmari: "#d5a1ff", Sneeuw: "#ff91c4" }[resource];
  return (
    <section
      lang="nl"
      className={styles.scene}
      style={{ "--reward-accent": accent } as CSSProperties}
    >
      <Image
        src={artwork.src}
        alt={artwork.alt}
        fill
        priority
        sizes="(max-width: 640px) 100vw, 640px"
        className={styles.art}
      />
      <div className={styles.shade} aria-hidden="true" />
      <header className={styles.header}>
        <span className={styles.badge}>
          <Dice5 size={18} aria-hidden="true" />
          {roll} ogen gegooid
        </span>
        <span className={styles.badge}>
          <Sparkles size={16} aria-hidden="true" />
          BUIT BINNEN
        </span>
      </header>
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Resource verdiend</p>
        <h1 tabIndex={-1} ref={focusHeading} className={`reward-pop font-display ${styles.title}`}>
          <span>+1</span> {resource}
        </h1>
        <p className="mt-3 text-sm text-parchment/85">Matthew, je voorraad groeit!</p>
        <p className={styles.exchange}>
          <Repeat2 size={16} aria-hidden="true" />
          {resourceExchangeLabels[resource]}
        </p>
        <p role="status" className="sr-only">
          Je krijgt 1 {resource}.
        </p>
        <ResourceInventory inventory={inventory} resource={resource} delta="+1" />
        <ActionButton fullWidth size="lg" iconRight={ArrowRight} onClick={onContinue}>
          Naar de map
        </ActionButton>
      </div>
    </section>
  );
}

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus({ preventScroll: true });
}
