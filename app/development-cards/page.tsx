"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DevelopmentCardsIcon } from "@/components/ui/DevelopmentCardsIcon";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { useJourneyLocations } from "@/lib/ui/useJourneyLocations";
import { useDevelopmentCards } from "@/lib/ui/useDevelopmentCards";

export default function DevelopmentCardsPage() {
  const legacyCards = useDevelopmentCards();
  const journey = useJourneyLocations();
  const earned = journey.data?.locations.filter((item) => item.result?.correct) ?? [];
  const cards = [
    ...earned.map((item) => ({
      id: `location-${item.id}`,
      location: item.name,
      bonus: item.result!.bonus,
      description: `Verdiend bij locatie ${item.id}: ${item.name}.`
    })),
    ...legacyCards.filter(
      (card) => !earned.some((item) => item.id === "1" && card.id === "bierpaleis")
    )
  ];
  return (
    <main lang="nl" className="hall min-h-dvh px-5 py-8">
      <div className="mx-auto max-w-lg space-y-7">
        <Link
          href="/journey"
          className="trippy-button inline-flex min-h-11 items-center gap-2 rounded-lg bg-parchment px-4 font-bold text-ink"
        >
          <ArrowLeft size={18} aria-hidden="true" /> Terug naar de kaart
        </Link>
        <header>
          <span className="mb-4 inline-flex rounded-xl border-2 border-ink bg-[#c681f5] p-3 text-ink shadow-seal">
            <DevelopmentCardsIcon width={32} height={32} />
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-bright">
            Matthews verzameling
          </p>
          <h1 className="mt-2 break-words text-3xl font-bold">Ontwikkelingskaarten</h1>
          <p className="mt-3 text-parchment/80">
            Hier lees je de bonussen terug die je met goede antwoorden hebt verdiend.
          </p>
        </header>
        {journey.error && (
          <p role="alert">
            {journey.error} Eerder verdiende locatiekaarten verschijnen zodra de verbinding is
            hersteld.
          </p>
        )}
        {!journey.data && !journey.error && <p>Locatiekaarten laden…</p>}
        {cards.length === 0 ? (
          <ParchmentCard className="space-y-3 p-5">
            <h2 className="text-xl font-bold">Je hebt nog geen kaarten</h2>
            <p>Beantwoord een quizvraag goed om je eerste ontwikkelingskaart te verdienen.</p>
          </ParchmentCard>
        ) : (
          <ul aria-label="Verdiende ontwikkelingskaarten" className="space-y-5">
            {cards.map((card) => (
              <li key={card.id}>
                <ParchmentCard as="article" variant="raised" className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-sepia-muted">{card.location}</p>
                    <span className="rounded-sm border-2 border-ink bg-gold px-2 py-1 text-xs font-bold">
                      VERDIEND
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{card.bonus}</h2>
                  <p>{card.description}</p>
                  <p className="border-t-2 border-ink pt-3 text-sm text-sepia-muted">
                    Het gebruiken van deze bonus volgt later.
                  </p>
                </ParchmentCard>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
