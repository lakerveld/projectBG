"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DevelopmentCardsIcon } from "@/components/ui/DevelopmentCardsIcon";
import { useRewardInventory, writeInventory } from "@/lib/ui/useRewardInventory";
import { resourceColors } from "@/lib/ui/resourceColors";
import { useDevelopmentCards } from "@/lib/ui/useDevelopmentCards";
import { Wheat, Dice5, Snowflake, TestTube } from "lucide-react";
import { DiceTotalPicker } from "@/components/ui/DiceTotalPicker";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { ActionButton } from "@/components/ui/ActionButton";

import { LocationQuiz } from "./LocationQuiz";
import { LocationMap, locationStatusLabels } from "./LocationMap";
import { Modal } from "@/components/ui/Modal";
import { LocationStory } from "./LocationStory";
import { useJourneyLocations } from "@/lib/ui/useJourneyLocations";
import { RobberReveal } from "./RobberReveal";
import { JourneyFinale } from "./JourneyFinale";
import { DigitalDice } from "./DigitalDice";
import { RewardReveal } from "./RewardReveal";
import {
  resourceExchangeLabels,
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
  const journey = useJourneyLocations();
  return <JourneyMapContent key={journey.data?.resetId ?? "initial"} journey={journey} />;
}

function JourneyMapContent({ journey }: { journey: ReturnType<typeof useJourneyLocations> }) {
  const cards = useDevelopmentCards();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const closeLocation = useCallback(() => setSelectedLocation(null), []);
  const [quizLocation, setQuizLocation] = useState<string | null>(null);
  const location = journey.data?.locations.find((item) => item.id === selectedLocation);
  const activeQuiz = journey.data?.locations.find((item) => item.id === quizLocation);
  const serverCards =
    journey.data?.locations.filter((item) => item.result?.correct && item.result.bonus) ?? [];
  const cardCount = serverCards.length + cards.length;
  const [finaleOpen, setFinaleOpen] = useState(false);
  const [finalePending, setFinalePending] = useState(false);
  const allCompleted =
    journey.data?.locations.length === 6 &&
    journey.data.locations.every((item) => item.status === "completed");
  const [enteringRoll, setEnteringRoll] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const [digitalOpen, setDigitalOpen] = useState(false);
  const [digitalDice, setDigitalDice] = useState<[number, number] | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const { inventory } = useRewardInventory();
  const [reward, setReward] = useState<RewardResource | null>(null);
  const [robbery, setRobbery] = useState<{ resource: RewardResource | null } | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [tradeMessage, setTradeMessage] = useState("");
  const [selectedResource, setSelectedResource] = useState<RewardResource | null>(null);
  const closeResource = useCallback(() => setSelectedResource(null), []);

  function consume(option: (typeof consumptionOptions)[number]) {
    const { resource, cost, label } = option;
    if (inventory[resource] < cost) return;
    const next = { ...inventory, [resource]: inventory[resource] - cost };
    try {
      writeInventory(next);
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
      writeInventory(next);
      setStorageError(false);
      setTradeMessage(`Geruild: −${cost} gerst, +${amount} ${resource}.`);
    } catch {
      setTradeMessage(
        "Ruilen is niet gelukt: je voorraad kon niet worden opgeslagen. Probeer opnieuw."
      );
    }
  }

  function confirmRoll() {
    if (selectedTotal === null) return;
    const resource = resourceForRoll(selectedTotal);
    const theft = resource === null ? stealRandomResource(inventory) : null;
    const next = resource
      ? { ...inventory, [resource]: inventory[resource] + 1 }
      : theft!.inventory;
    if (theft) setRobbery({ resource: theft.resource });
    try {
      writeInventory(next);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    setReward(resource);
    setLastRoll(selectedTotal);
    setEnteringRoll(false);
    setDigitalOpen(false);
  }

  if (activeQuiz && activeQuiz.status !== "locked")
    return (
      <LocationQuiz
        key={activeQuiz.id}
        location={activeQuiz}
        busy={journey.busy}
        error={journey.error}
        onAnswer={async (answer) => {
          const next = await journey.command(activeQuiz.id, "answer", answer);
          const completed = next?.locations.find((item) => item.id === "6");
          if (activeQuiz.id === "6" && activeQuiz.status !== "completed" && completed?.result) {
            setFinalePending(true);
          }
        }}
        onClose={() => {
          setQuizLocation(null);
          if (finalePending) {
            setFinalePending(false);
            setFinaleOpen(true);
          }
        }}
      />
    );

  if (finaleOpen) {
    return <JourneyFinale onContinue={() => setFinaleOpen(false)} />;
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
      className="relative min-h-dvh w-full pt-[env(safe-area-inset-top)]"
    >
      <h1 className="sr-only">Kaart van Antwerpen</h1>
      <div className="w-full">
        <div>
          <Modal
            open={selectedResource !== null}
            onClose={closeResource}
            title={
              selectedResource
                ? `${selectedResource} · ${inventory[selectedResource]} in voorraad`
                : "Resources"
            }
            description={selectedResource ? resourceExchangeLabels[selectedResource] : undefined}
            icon={resources.find(({ name }) => name === selectedResource)?.icon}
            iconColor={selectedResource ? resourceColors[selectedResource] : undefined}
            className="max-h-[85dvh] overflow-y-auto"
          >
            <div className="mt-4 border-t border-ink/20 pt-4">
              <h2 className="font-display text-sm font-bold">Gebruiken</h2>
              <p className="mt-1 font-body text-sm">
                De gebruikte resources gaan direct van je voorraad af.
              </p>
              <div className="mt-3 space-y-3">
                {consumptionOptions
                  .filter((option) => option.resource === selectedResource)
                  .map((option) => (
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
            {selectedResource === "Gerst" && (
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
              </div>
            )}
            {tradeMessage && (
              <p role="status" className="mt-3 font-body text-sm">
                {tradeMessage}
              </p>
            )}
          </Modal>
          {journey.notice && (
            <div
              role="status"
              className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-ink bg-gold-bright p-3 font-bold text-ink"
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
          <div className="relative isolate pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <LocationMap
              data={journey.data}
              onFinale={allCompleted ? () => setFinaleOpen(true) : undefined}
              onSelect={(id) => {
                setSelectedLocation(id);
              }}
            />
            <ul
              aria-label="Resources"
              className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start gap-2 bg-gradient-to-b from-night-deep/50 to-transparent px-3 pb-8 pt-3 sm:gap-3 sm:p-5"
            >
              {resources.map(({ name, icon: Icon }) => (
                <li
                  key={name}
                  aria-label={`${name}: ${inventory[name]}`}
                  className="pointer-events-auto"
                >
                  <button
                    type="button"
                    aria-label={`${name}: ${inventory[name]}, bekijk opties`}
                    aria-haspopup="dialog"
                    onClick={() => {
                      setTradeMessage("");
                      setSelectedResource(name);
                    }}
                    title={name}
                    style={{ backgroundColor: resourceColors[name] }}
                    className="flex h-11 w-20 items-center justify-center gap-2 rounded-full border-2 border-ink/70 px-2 text-ink shadow-[0_4px_0_#302039,0_6px_10px_#00000055] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-1 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none"
                  >
                    <Icon size={18} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />
                    <span className="font-display text-base font-bold tabular-nums">
                      {inventory[name]}
                    </span>
                  </button>
                </li>
              ))}
              <li className="pointer-events-auto ml-auto">
                <Link
                  href="/development-cards"
                  aria-label={`Ontwikkelingskaarten: ${cardCount}`}
                  title="Ontwikkelingskaarten"
                  className="trippy-button flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg bg-[#c681f5] px-3 text-ink shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <DevelopmentCardsIcon />
                  <span aria-hidden="true" className="text-sm font-bold">
                    {cardCount}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <Modal
            height="tall"
            open={selectedLocation !== null}
            onClose={closeLocation}
            title={
              location && location.status !== "locked"
                ? location.name
                : `Locatie ${selectedLocation}`
            }
            description={
              !location
                ? "De locatiestatus is nog niet beschikbaar. Probeer het zo opnieuw."
                : location.status === "locked"
                  ? "Deze locatie is nog op slot. Jullie begeleiders geven deze vrij zodra jullie er zijn."
                  : location.status === "completed"
                    ? "Je hebt deze locatie al afgerond."
                    : !location.ready
                      ? "Deze locatie is vrijgegeven. Bekijk de locatie en het verhaal; de quiz volgt zodra deze klaar is."
                      : "Wil je deze locatie activeren en de quest openen?"
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
                      if (!location.ready) {
                        setQuizLocation(location.id);
                        setSelectedLocation(null);
                        return;
                      }
                      const next = await journey.command(location.id, "start");
                      if (next) {
                        setQuizLocation(location.id);
                        setSelectedLocation(null);
                      }
                    }}
                  >
                    {!location.ready
                      ? "Activeren"
                      : location.status === "available"
                        ? "Activeren"
                        : location.status === "completed"
                          ? "Bekijk resultaat"
                          : locationStatusLabels[location.status]}
                  </ActionButton>
                )}
              </>
            }
          >
            {location?.image && location.status !== "locked" && (
              <Image
                src={location.image}
                alt={`Psychedelische illustratie van ${location.name}`}
                width={1024}
                height={1024}
                sizes="(max-width: 640px) 85vw, 400px"
                className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"
              />
            )}
            {location?.story && location.status !== "locked" && (
              <section className="text-sepia">
                <h3 className="mb-2 font-display text-lg font-bold">Het verhaal</h3>
                <LocationStory story={location.story} />
              </section>
            )}
            {journey.error && <p>{journey.error}</p>}
          </Modal>
          <div className="pointer-events-none fixed inset-x-0 bottom-[env(safe-area-inset-bottom)] z-30 p-3">
            {storageError && (
              <p role="alert" className="mb-3 text-parchment">
                Je score is alleen voor deze sessie bewaard. Lokale opslag is niet beschikbaar.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                type="button"
                icon={Dice5}
                className="pointer-events-auto"
                style={{ backgroundColor: "#d5fa55bf" }}
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
                className="trippy-button pointer-events-auto flex min-h-14 items-center justify-center gap-2 rounded-xl border border-ink bg-[#c681f5bf] px-3 font-display font-bold text-ink focus-visible:outline-2 focus-visible:outline-gold-bright"
              >
                🐀 Rattenrad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
