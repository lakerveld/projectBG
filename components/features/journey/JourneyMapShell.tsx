"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DevelopmentCardsIcon } from "@/components/ui/DevelopmentCardsIcon";
import { useDevelopmentCards } from "@/lib/ui/useDevelopmentCards";
import { Wheat, Dice5, Snowflake, TestTube, Info, ChevronDown } from "lucide-react";
import { DiceTotalPicker } from "@/components/ui/DiceTotalPicker";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { ActionButton } from "@/components/ui/ActionButton";

import { LocationQuiz } from "./LocationQuiz";
import { LocationMap, locationStatusLabels } from "./LocationMap";
import { Modal } from "@/components/ui/Modal";
import { useJourneyLocations } from "@/lib/ui/useJourneyLocations";
import { RobberReveal } from "./RobberReveal";
import { JourneyFinale } from "./JourneyFinale";
import { DigitalDice } from "./DigitalDice";
import { RewardReveal } from "./RewardReveal";
import {
  emptyInventory,
  resourceExchangeLabels,
  readInventory,
  stealRandomResource,
  resourceForRoll,
  type RewardResource
} from "@/lib/domain/journeyRewards";

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

const resources = [
  { name: "Gerst", icon: Wheat },
  { name: "Salmari", icon: TestTube },
  { name: "Sneeuw", icon: Snowflake }
] as const;

const consumptionOptions = [
  { resource: "Gerst", cost: 3, label: "1 biertje" },
  { resource: "Salmari", cost: 1, label: "1 shotje" },
  { resource: "Sneeuw", cost: 2, label: "1 nakkie" }
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
  const cardCount = serverCards.length + cards.length;
  const [dismissedFinale, setDismissedFinale] = useState<string | null>(null);
  const allCompleted =
    journey.data?.locations.length === 6 &&
    journey.data.locations.every((item) => item.status === "completed");
  const finaleKey = allCompleted
    ? journey.data!.locations.map((item) => `${item.id}:${item.unlockedAt ?? 0}`).join("|")
    : null;
  const [enteringRoll, setEnteringRoll] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const [digitalOpen, setDigitalOpen] = useState(false);
  const [digitalDice, setDigitalDice] = useState<[number, number] | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const [inventory, setInventory] = useState(emptyInventory);
  const [reward, setReward] = useState<RewardResource | null>(null);
  const [robbery, setRobbery] = useState<{ resource: RewardResource | null } | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [tradeMessage, setTradeMessage] = useState("");

  function consume(option: (typeof consumptionOptions)[number]) {
    const { resource, cost, label } = option;
    if (inventory[resource] < cost) return;
    const next = { ...inventory, [resource]: inventory[resource] - cost };
    try {
      localStorage.setItem("rattan-journey-inventory", JSON.stringify(next));
      setInventory(next);
      setStorageError(false);
      setTradeMessage(`Gebruikt voor ${label}: −${cost} ${resource}.`);
    } catch {
      setTradeMessage(
        "Gebruiken is niet gelukt: je voorraad kon niet worden opgeslagen. Probeer opnieuw."
      );
    }
  }

  function trade(resource: "Salmari" | "Sneeuw") {
    const cost = resource === "Salmari" ? 5 : 10;
    const amount = resource === "Salmari" ? 1 : 2;
    if (inventory.Gerst < cost) return;
    const next = {
      ...inventory,
      Gerst: inventory.Gerst - cost,
      [resource]: inventory[resource] + amount
    };
    try {
      localStorage.setItem("rattan-journey-inventory", JSON.stringify(next));
      setInventory(next);
      setStorageError(false);
      setTradeMessage(`Geruild: −${cost} gerst, +${amount} ${resource}.`);
    } catch {
      setTradeMessage(
        "Ruilen is niet gelukt: je voorraad kon niet worden opgeslagen. Probeer opnieuw."
      );
    }
  }
  useEffect(() => {
    // Hydrate browser-only storage after the server-rendered initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInventory(readInventory());
  }, []);

  function confirmRoll() {
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
    setDigitalOpen(false);
  }

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

  if (finaleKey && dismissedFinale !== finaleKey) {
    return <JourneyFinale onContinue={() => setDismissedFinale(finaleKey)} />;
  }

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
            Gooi je dobbelstenen en kies het totaal van 2 tot 12, of dobbel hieronder digitaal.
          </p>
          <DiceTotalPicker
            totals={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            selectedTotal={selectedTotal}
            onSelect={(total) => {
              setSelectedTotal(total);
              setDigitalDice(null);
            }}
          />
          <ActionButton
            fullWidth
            icon={Dice5}
            disabled={selectedTotal === null}
            onClick={() => {
              confirmRoll();
            }}
          >
            Bevestig worp
          </ActionButton>
          <ActionButton
            fullWidth
            variant="iron"
            icon={Dice5}
            onClick={() => {
              const first = Math.floor(Math.random() * 6) + 1;
              const second = Math.floor(Math.random() * 6) + 1;
              setDigitalDice([first, second]);
              setDigitalOpen(true);
              setSelectedTotal(first + second);
            }}
          >
            Digitaal dobbelen
          </ActionButton>
          {digitalDice && !digitalOpen && (
            <p role="status" className="text-center font-body text-sepia">
              Je gooide {digitalDice[0]} + {digitalDice[1]} = {selectedTotal} ogen. Bevestig je worp
              om verder te gaan.
            </p>
          )}
        </ParchmentCard>
        {digitalOpen && digitalDice && (
          <DigitalDice
            dice={digitalDice}
            onClose={() => setDigitalOpen(false)}
            onConfirm={confirmRoll}
          />
        )}
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
            className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] divide-x divide-ink bg-[#ff91c4] px-2 pb-2 pt-4"
          >
            {resources.map(({ name, icon: Icon }) => (
              <li
                key={name}
                aria-label={`${name}: ${inventory[name]}`}
                title={`${name}: ${resourceExchangeLabels[name]}`}
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
          <details className="group border-b-2 border-ink bg-[#ff91c4] text-ink">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 px-4 font-body text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              <Info size={16} aria-hidden="true" />
              Wat zijn je resources waard?
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <div className="mx-3 mb-3 rounded-xl border border-ink/20 bg-white/40 p-4">
              <p className="mb-3 font-body text-sm">Dit verzamel je tijdens je tocht:</p>
              <dl className="space-y-3">
                {resources.map(({ name, icon: Icon }) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/50">
                      <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="font-display text-sm font-bold">{name}</dt>
                      <dd className="font-body text-sm">{resourceExchangeLabels[name]}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-4 border-t border-ink/20 pt-4">
                <h2 className="font-display text-sm font-bold">Gebruiken</h2>
                <p className="mt-1 font-body text-sm">
                  De gebruikte resources gaan direct van je voorraad af.
                </p>
                <div className="mt-3 space-y-3">
                  {consumptionOptions.map((option) => (
                    <div key={option.resource}>
                      <button
                        type="button"
                        disabled={inventory[option.resource] < option.cost}
                        onClick={() => consume(option)}
                        className="min-h-11 w-full rounded-lg border border-ink bg-ink px-3 py-2 font-body text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Gebruik {option.cost} {option.resource.toLowerCase()} voor {option.label}
                      </button>
                      {inventory[option.resource] < option.cost && (
                        <p className="mt-1 font-body text-xs">
                          Nog {option.cost - inventory[option.resource]}{" "}
                          {option.resource.toLowerCase()} nodig
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-ink/20 pt-4">
                <h2 className="font-display text-sm font-bold">Ruilen</h2>
                <p className="mt-1 font-body text-sm">
                  Ruil gerst in. Je nieuwe resources worden direct aan je voorraad toegevoegd.
                </p>
                <div className="mt-3 space-y-3">
                  {(
                    [
                      {
                        resource: "Sneeuw",
                        cost: 10,
                        label: "1 nakkie",
                        detail: "+2 sneeuw",
                        icon: Snowflake
                      },
                      {
                        resource: "Salmari",
                        cost: 5,
                        label: "1 Salmari",
                        detail: "+1 Salmari",
                        icon: TestTube
                      }
                    ] as const
                  ).map(({ resource, cost, label, detail, icon: Icon }) => (
                    <div key={resource} className="rounded-lg border border-ink/20 bg-white/40 p-3">
                      <div className="flex items-center gap-2 font-body text-sm font-semibold">
                        <Icon size={18} aria-hidden="true" />
                        {cost} gerst = {label}
                      </div>
                      <p className="mt-1 font-body text-xs">
                        Voorraad: −{cost} gerst, {detail}
                      </p>
                      <button
                        type="button"
                        disabled={inventory.Gerst < cost}
                        onClick={() => trade(resource)}
                        className="mt-2 min-h-11 w-full rounded-lg border border-ink bg-ink px-3 py-2 font-body text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Ruil {cost} gerst voor {label}
                      </button>
                      {inventory.Gerst < cost && (
                        <p className="mt-1 font-body text-xs">
                          Nog {cost - inventory.Gerst} gerst nodig
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {tradeMessage && (
                  <p role="status" className="mt-3 font-body text-sm">
                    {tradeMessage}
                  </p>
                )}
              </div>
            </div>
          </details>
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
            {location?.time && <p className="mb-2 font-bold">{location.time}</p>}
            {location?.story && location.status !== "locked" && (
              <p className="mb-3">{location.story}</p>
            )}
            {journey.error && <p role="alert">{journey.error}</p>}
          </Modal>
          <div className="border-t-2 border-ink bg-night p-4">
            {allCompleted && (
              <ActionButton
                fullWidth
                variant="iron"
                className="mb-3"
                onClick={() => setDismissedFinale(null)}
              >
                Bekijk de finale
              </ActionButton>
            )}
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
                setDigitalDice(null);
                setEnteringRoll(true);
              }}
            >
              DICE
            </ActionButton>
            <Link
              href="/rattenrad"
              className="trippy-button mt-3 flex min-h-14 items-center justify-center rounded-xl border border-ink bg-[#c681f5] px-4 font-display font-bold text-ink focus-visible:outline-2 focus-visible:outline-gold-bright"
            >
              🐀 Het rattenrad — wie trakteert?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
