"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DevelopmentCardsIcon } from "@/components/ui/DevelopmentCardsIcon";
import { useDevelopmentCards } from "@/lib/ui/useDevelopmentCards";
import { Beer, Dice5, Utensils } from "lucide-react";
import { PowderedSugarIcon } from "@/components/ui/PowderedSugarIcon";
import { ShotGlassIcon } from "@/components/ui/ShotGlassIcon";
import { DiceTotalPicker } from "@/components/ui/DiceTotalPicker";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { ActionButton } from "@/components/ui/ActionButton";

import { LocationQuiz } from "./LocationQuiz";
import { LocationMap, locationStatusLabels } from "./LocationMap";
import { Modal } from "@/components/ui/Modal";
import { useJourneyLocations } from "@/lib/ui/useJourneyLocations";
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
  { name: "Salmiak", icon: ShotGlassIcon },
  { name: "Poedersuiker", icon: PowderedSugarIcon },
  { name: "Eten", icon: Utensils }
] as const;

export function JourneyMapShell() {
  const cards = useDevelopmentCards();
  const journey = useJourneyLocations();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const closeLocation = useCallback(() => setSelectedLocation(null), []);
  const [quizLocation, setQuizLocation] = useState<string | null>(null);
  const location = journey.data?.locations.find((item) => item.id === selectedLocation);
  const activeQuiz = journey.data?.locations.find((item) => item.id === quizLocation);
  const serverCards = journey.data?.locations.filter((item) => item.result?.correct) ?? [];
  const cardCount =
    serverCards.length +
    cards.filter((card) => !serverCards.some((item) => item.id === "1" && card.id === "bierpaleis"))
      .length;
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

  if (activeQuiz?.quiz)
    return (
      <LocationQuiz
        key={activeQuiz.id}
        location={activeQuiz}
        busy={journey.busy}
        error={journey.error}
        onAnswer={(answer) => {
          void journey.command(activeQuiz.id, "answer", answer);
        }}
        onClose={() => setQuizLocation(null)}
      />
    );

  if (robbery !== null) {
    return (
      <RobberReveal
        resource={robbery.resource}
        inventory={inventory}
        storageError={storageError}
        onContinue={() => {
          setRobbery(null);
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
      className="flex min-h-dvh w-full items-start pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <h1 className="sr-only">Kaart van Antwerpen</h1>
      <div className="w-full overflow-hidden">
        <div className="overflow-hidden">
          <ul
            aria-label="Resources"
            className="grid grid-cols-[repeat(4,minmax(0,1fr))_auto] divide-x divide-ink border-b-2 border-ink bg-[#ff91c4] px-2 py-4"
          >
            {resources.map(({ name, icon: Icon }) => (
              <li
                key={name}
                aria-label={`${name}: ${inventory[name]}`}
                title={name}
                className="flex items-center justify-center gap-1 text-ink sm:gap-2"
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
            <li className="pl-2">
              <Link
                href="/development-cards"
                aria-label={`Ontwikkelingskaarten: ${cardCount}`}
                title="Ontwikkelingskaarten"
                className="trippy-button flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg bg-[#c681f5] px-2 text-ink"
              >
                <DevelopmentCardsIcon />
                <span aria-hidden="true" className="text-sm font-bold">
                  {cardCount}
                </span>
              </Link>
            </li>
          </ul>
          {journey.notice && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 border-b-2 border-ink bg-gold-bright p-4 font-bold text-ink"
            >
              <p>{journey.notice}</p>
              <button
                type="button"
                onClick={journey.dismissNotice}
                className="min-h-11 px-3 underline"
                aria-label="Melding sluiten"
              >
                Sluiten
              </button>
            </div>
          )}
          {journey.error && (
            <p role="alert" className="bg-night p-3 text-parchment">
              {journey.error}
            </p>
          )}
          {!journey.data && !journey.error && (
            <p className="bg-night p-2 text-center text-parchment">Locaties laden…</p>
          )}
          <LocationMap data={journey.data} onSelect={setSelectedLocation} />
          <Modal
            open={selectedLocation !== null}
            onClose={closeLocation}
            title={location?.name ?? `Locatie ${selectedLocation}`}
            description={
              !location
                ? "De locatiestatus is nog niet beschikbaar. Probeer het zo opnieuw."
                : location.status === "locked"
                  ? "Deze locatie is nog op slot. Jullie begeleiders geven deze vrij zodra jullie er zijn."
                  : location.status === "completed"
                    ? "Je hebt deze locatie al afgerond."
                    : "Wil je deze locatie activeren en de quiz openen?"
            }
            footer={
              <>
                <ActionButton variant="iron" onClick={() => setSelectedLocation(null)}>
                  Terug
                </ActionButton>
                {location && location.status !== "locked" && (
                  <ActionButton
                    loading={journey.busy}
                    onClick={async () => {
                      const next = await journey.command(location.id, "start");
                      if (next) {
                        setQuizLocation(location.id);
                        setSelectedLocation(null);
                      }
                    }}
                  >
                    {location.status === "available"
                      ? "Activeren"
                      : location.status === "completed"
                        ? "Bekijk resultaat"
                        : locationStatusLabels[location.status]}
                  </ActionButton>
                )}
              </>
            }
          >
            {journey.error && <p role="alert">{journey.error}</p>}
          </Modal>
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
