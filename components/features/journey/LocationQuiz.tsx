"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/ui/ActionButton";
import { DevelopmentEventCard } from "@/components/ui/WorldEventCard";
import type { LocationView } from "@/lib/domain/locationGame";

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

export function LocationQuiz({
  location,
  busy,
  error,
  onAnswer,
  onClose
}: {
  location: LocationView;
  busy: boolean;
  error: string;
  onAnswer: (answer: number) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const quiz = location.quiz!;
  return (
    <section lang="nl" className="relative isolate min-h-dvh overflow-hidden">
      <Image
        src={location.id === "1" ? "/rewards/bierpaleis.png" : "/maps/antwerp-journey.png"}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night-deep/40 via-night-deep/80 to-night-deep" />
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col gap-5 px-5 py-8">
        <ActionButton variant="iron" onClick={onClose}>
          Terug naar de kaart
        </ActionButton>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-bright">
          Locatie {location.id} · Ontwikkelingskaart
        </p>
        <h1
          tabIndex={-1}
          ref={focusHeading}
          className="font-display text-4xl font-bold text-parchment outline-none"
        >
          {location.name}
        </h1>
        <div className="min-h-16 flex-1" />
        <DevelopmentEventCard bonus={quiz.bonus} />
        <div className="space-y-5 rounded-3xl border border-gold/40 bg-night-deep/95 p-5 text-parchment">
          {location.result ? (
            <>
              <div role="status" className="space-y-3">
                <h2 className="text-2xl font-bold text-gold-bright">
                  {location.result.correct
                    ? "Goed geantwoord!"
                    : "Helaas, dat is niet het juiste antwoord."}
                </h2>
                <p>
                  {location.result.correct
                    ? `Je hebt een ontwikkelingskaart verdiend: ${location.result.bonus}.`
                    : `Het juiste antwoord is: ${location.result.correctAnswer}`}
                </p>
                <p className="text-sm">Deze locatie is afgerond.</p>
              </div>
              {location.result.correct && (
                <Link className="block underline" href="/development-cards">
                  Bekijk je ontwikkelingskaarten
                </Link>
              )}
              <ActionButton fullWidth onClick={onClose}>
                Verder naar de kaart
              </ActionButton>
            </>
          ) : (
            <>
              <fieldset disabled={busy} className="space-y-3">
                <legend className="mb-4 text-xl font-bold">{quiz.question}</legend>
                {quiz.answers.map((answer, index) => (
                  <label
                    key={index}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-3 ${selected === index ? "border-gold-bright bg-gold/20" : "border-parchment/30"}`}
                  >
                    <input
                      type="radio"
                      name={`location-${location.id}`}
                      checked={selected === index}
                      onChange={() => setSelected(index)}
                    />
                    <span>
                      {"ABCD"[index]}. {answer}
                    </span>
                  </label>
                ))}
              </fieldset>
              <ActionButton
                fullWidth
                loading={busy}
                disabled={selected === null}
                onClick={() => {
                  if (selected !== null) onAnswer(selected);
                }}
              >
                Bevestig antwoord
              </ActionButton>
            </>
          )}
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
    </section>
  );
}
