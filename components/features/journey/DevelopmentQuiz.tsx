"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { awardDevelopmentCard } from "@/lib/ui/useDevelopmentCards";
import { developmentCards } from "@/lib/domain/developmentCards";
import { ActionButton } from "@/components/ui/ActionButton";
import { DevelopmentEventCard } from "@/components/ui/WorldEventCard";

const answers = [
  "Prik & Tik, uw drankenspecialist",
  "Pak & Proef, voor iedere dorstige rat",
  "Kraak & Smaak, het paradijs voor drank",
  "Plop & Proost, uw meester in bier"
];

export function DevelopmentQuiz({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const correct = selected === 0;

  return (
    <section lang="nl" className="relative isolate min-h-dvh overflow-hidden">
      <Image
        src="/rewards/bierpaleis.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night-deep/10 via-night-deep/65 to-night-deep"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 py-8">
        <p className="font-display text-xs uppercase tracking-[0.25em] text-gold-bright">
          De eerste handelspost
        </p>
        <h1
          ref={focusHeading}
          tabIndex={-1}
          className="mt-3 font-display text-4xl font-bold text-parchment outline-none [text-shadow:0_2px_12px_#000]"
        >
          Het Bierpaleis
        </h1>
        <div aria-hidden="true" className="min-h-40 flex-1" />
        <DevelopmentEventCard bonus={developmentCards[0].bonus} />
        <div className="mt-5 rounded-3xl border border-gold/40 bg-night-deep/90 p-5 shadow-glow backdrop-blur-sm">
          <div className="space-y-3 font-body text-base leading-relaxed text-parchment/85">
            <p>
              De Ketanisten hebben hun eerste handelspost bereikt. Volgens de legende ligt hier één
              van de grootste drankvoorraden van Rattan.
            </p>
            <p>Maar de poort blijft gesloten.</p>
            <p>
              Boven de ingang staan vier oude spreuken gekrast. Slechts één daarvan is de{" "}
              <strong className="text-parchment">echte leus van het Bierparadijs</strong>.
            </p>
          </div>
          <fieldset disabled={submitted} className="mt-5">
            <legend className="mb-3 font-display text-xl font-bold text-parchment">
              Welke spreuk is echt?
            </legend>
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <label
                  key={answer}
                  className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border p-3 font-body text-sm leading-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-bright ${selected === index ? "border-gold-bright bg-gold/20 text-parchment" : "border-parchment/25 bg-white/5 text-parchment/85"} ${submitted ? "cursor-default" : "hover:bg-gold/10"}`}
                >
                  <input
                    type="radio"
                    name="bierpaleis-answer"
                    aria-label={`${"ABCD"[index]}. ${answer}`}
                    value={index}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-gold/40 font-display font-bold text-gold-bright"
                  >
                    {"ABCD"[index]}
                  </span>
                  <span>
                    <span className="sr-only">{"ABCD"[index]}. </span>
                    {answer}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {submitted ? (
            <div className="mt-5 space-y-4">
              <div
                role="status"
                className="reward-pop rounded-xl border border-gold/40 bg-gold/10 p-4 font-body text-parchment"
              >
                <p className="font-display text-lg font-bold text-gold-bright">
                  {correct ? "Goed geantwoord!" : "Helaas, dat is niet de echte spreuk."}
                </p>
                <p className="mt-2">
                  {correct
                    ? "Je hebt de ontwikkelingskaart verdiend: ruil 1 bier voor 1 poedersuiker."
                    : "Het juiste antwoord is A: Prik & Tik, uw drankenspecialist."}
                </p>
                {correct && (
                  <p className="mt-2 text-sm text-parchment/70">
                    Het gebruiken van deze bonus volgt later.
                  </p>
                )}
              </div>
              {correct && (
                <Link
                  href="/development-cards"
                  className="trippy-button flex min-h-11 items-center justify-center rounded-lg bg-[#c681f5] px-3 font-bold text-ink"
                >
                  Bekijk je ontwikkelingskaarten
                </Link>
              )}
              {storageError && (
                <p role="alert" className="text-sm text-parchment">
                  Je kaart is alleen voor deze sessie bewaard. Lokale opslag is niet beschikbaar.
                </p>
              )}
              <ActionButton fullWidth size="lg" onClick={onContinue}>
                Verder naar de kaart
              </ActionButton>
            </div>
          ) : (
            <ActionButton
              className="mt-5"
              fullWidth
              size="lg"
              disabled={selected === null}
              onClick={() => {
                if (submitted || selected === null) return;
                if (correct) setStorageError(!awardDevelopmentCard(developmentCards[0].id));
                setSubmitted(true);
              }}
            >
              Bevestig antwoord
            </ActionButton>
          )}
        </div>
      </div>
    </section>
  );
}

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}
