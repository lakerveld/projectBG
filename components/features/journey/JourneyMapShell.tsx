"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Beer, Candy, Dice5, Utensils, Wheat } from "lucide-react";
import { DiceTotalPicker } from "@/components/ui/DiceTotalPicker";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { ActionButton } from "@/components/ui/ActionButton";

import { DevelopmentQuiz } from "./DevelopmentQuiz";
import { RobberReveal } from "./RobberReveal";
import { RewardReveal } from "./RewardReveal";
import {
  emptyInventory,
  readInventory,
  stealRandomResource,
  resourceForRoll,
  type RewardResource
} from "@/lib/domain/journeyRewards";

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

const resources = [
  { name: "Bier", icon: Beer },
  { name: "Salmiak", icon: Candy },
  { name: "Poedersuiker", icon: Wheat },
  { name: "Eten", icon: Utensils }
] as const;

export function JourneyMapShell() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [enteringRoll, setEnteringRoll] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const [inventory, setInventory] = useState(emptyInventory);
  const [reward, setReward] = useState<RewardResource | null>(null);
  const [robbery, setRobbery] = useState<{ resource: RewardResource | null } | null>(null);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    // Hydrate browser-only storage after the server-rendered initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInventory(readInventory());
  }, []);

  if (showQuiz) return <DevelopmentQuiz onContinue={() => setShowQuiz(false)} />;

  if (robbery !== null) {
    return (
      <RobberReveal
        resource={robbery.resource}
        inventory={inventory}
        storageError={storageError}
        onContinue={() => {
          setRobbery(null);
          setShowQuiz(true);
        }}
      />
    );
  }

  if (reward !== null && lastRoll !== null) {
    return (
      <RewardReveal
        resource={reward}
        inventory={inventory}
        roll={lastRoll}
        onContinue={() => {
          setReward(null);
          setShowQuiz(true);
        }}
      />
    );
  }

  if (enteringRoll) {
    return (
      <section
        lang="nl"
        className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-5 px-5 py-8"
      >
        <ActionButton variant="ghost" onClick={() => setEnteringRoll(false)}>
          Terug naar de kaart
        </ActionButton>
        <ParchmentCard className="space-y-5 p-5">
          <h1
            tabIndex={-1}
            ref={focusHeading}
            className="font-display text-2xl font-bold text-sepia outline-none"
          >
            Matthew, hoeveel ogen heb je gegooid?
          </h1>
          <p className="font-body text-sepia">
            Gooi je dobbelstenen en kies het totaal van 2 tot 12.
          </p>
          <DiceTotalPicker
            totals={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            selectedTotal={selectedTotal}
            onSelect={setSelectedTotal}
          />
          <ActionButton
            fullWidth
            icon={Dice5}
            disabled={selectedTotal === null}
            onClick={() => {
              if (selectedTotal === null) return;
              const resource = resourceForRoll(selectedTotal);
              const theft = resource === null ? stealRandomResource(inventory) : null;
              const next = resource
                ? { ...inventory, [resource]: inventory[resource] + 1 }
                : theft!.inventory;
              if (theft) setRobbery({ resource: theft.resource });
              setInventory(next);
              try {
                localStorage.setItem("rattan-journey-inventory", JSON.stringify(next));
                setStorageError(false);
              } catch {
                setStorageError(true);
              }
              setReward(resource);
              setLastRoll(selectedTotal);
              setEnteringRoll(false);
            }}
          >
            Bevestig worp
          </ActionButton>
        </ParchmentCard>
      </section>
    );
  }

  return (
    <section
      aria-label="Kaart van Antwerpen"
      lang="nl"
      className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-3 py-[max(0.75rem,env(safe-area-inset-top),env(safe-area-inset-bottom))] sm:px-5"
    >
      <h1 className="sr-only">Kaart van Antwerpen</h1>
      <div className="w-full overflow-hidden rounded-3xl border-2 border-ink bg-arcane p-1.5 shadow-parchment">
        <div className="overflow-hidden rounded-lg border-2 border-ink">
          <ul
            aria-label="Resources"
            className="grid grid-cols-4 divide-x divide-ink border-b-2 border-ink bg-[#ff91c4] px-2 py-4"
          >
            {resources.map(({ name, icon: Icon }) => (
              <li
                key={name}
                aria-label={`${name}: ${inventory[name]}`}
                title={name}
                className="flex items-center justify-center gap-2 text-ink"
              >
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="font-display text-xl font-bold tabular-nums text-ink"
                >
                  {inventory[name]}
                </span>
              </li>
            ))}
          </ul>
          <Image
            src="/maps/antwerp-journey.png"
            alt="Geïllustreerde kaart van Antwerpen met acht genummerde locaties, de Schelde en de kathedraal."
            width={941}
            height={1672}
            priority
            sizes="(max-width: 512px) 100vw, 460px"
            className="block h-auto w-full"
          />
          <div className="border-t-2 border-ink bg-night p-4">
            {storageError && (
              <p role="alert" className="mb-3 text-parchment">
                Je score is alleen voor deze sessie bewaard. Lokale opslag is niet beschikbaar.
              </p>
            )}
            {lastRoll !== null && (
              <p role="status" className="mb-3 text-center font-body text-parchment">
                Laatste worp: {lastRoll} ogen
              </p>
            )}
            <ActionButton
              type="button"
              icon={Dice5}
              fullWidth
              size="lg"
              onClick={() => {
                setSelectedTotal(null);
                setEnteringRoll(true);
              }}
            >
              DICE
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
