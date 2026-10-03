"use client";

import { RewardAction } from "./RewardAction";
import { LocationStory } from "./LocationStory";
import { rewardKey } from "@/lib/domain/locationRewards";
import { TreatWheel } from "@/components/features/journey/TreatWheel";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/ui/ActionButton";
import { DevelopmentEventCard } from "@/components/ui/WorldEventCard";
import type { LocationView } from "@/lib/domain/locationGame";

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

function ScoreInstructions({ question }: { question: string }) {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      {question
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph, index) => {
          if (/^puntentelling:?$/i.test(paragraph.trim()))
            return (
              <h3 key={index} className="pt-3 font-display text-lg font-bold text-gold-bright">
                {paragraph}
              </h3>
            );
          const parts = paragraph.split("→");
          if (parts.length === 2)
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-xl border border-parchment/20 bg-parchment/5 px-4 py-3"
              >
                <p className="min-w-0">{parts[0].trim()}</p>
                <p className="shrink-0 font-bold tabular-nums text-gold-bright">
                  {parts[1].trim()}
                </p>
              </div>
            );
          return (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          );
        })}
    </div>
  );
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
  const [score, setScore] = useState("");
  const [openedBeforeCompletion] = useState(() => !location.result);
  const quiz = location.quiz;
  const type = quiz?.type ?? "quiz";
  const completedQuestion = Boolean(location.result && type === "quiz");
  const petanque = location.id === "6" && type === "score";
  return (
    <section lang="nl" className="relative isolate min-h-dvh overflow-hidden">
      <Image
        src={
          location.status === "completed" && location.image
            ? location.image
            : "/maps/antwerp-six-locations.png"
        }
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night-deep/40 via-night-deep/80 to-night-deep" />
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col gap-5 px-5 py-8">
        {!completedQuestion && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-bright">
              Locatie {location.id}
              {quiz?.bonus ? " · Ontwikkelingskaart" : ""}
            </p>
            <h1
              tabIndex={-1}
              ref={focusHeading}
              className="font-display text-4xl font-bold text-parchment outline-none"
            >
              {location.name}
            </h1>
          </>
        )}
        {!location.result && quiz?.bonus && (
          <DevelopmentEventCard
            bonus={quiz.bonus}
            description={
              type === "purchase"
                ? "Bevestig je aankoop om deze beloning te verdienen. Ruilbeloningen voer je daarna zelf uit."
                : type === "score"
                  ? petanque
                    ? "18 punten of meer: +30 Sneeuw. Minder dan 18 punten: Matthew draait het traktatierad."
                    : "Vul je score in om deze beloning te verdienen."
                  : undefined
            }
          />
        )}
        {location.ready && type === "quiz" && !location.result && (
          <p className="rounded-xl border border-gold-bright/50 bg-night-deep/95 p-4 text-sm text-parchment">
            <strong>Fout antwoord? Matthew draait verplicht het rattenrad.</strong> Matthew
            trakteert; je draait alleen voor wat de traktatie wordt.
          </p>
        )}
        {!location.result && location.story && (
          <details className="rounded-2xl border border-parchment/30 bg-night-deep/85 p-4 text-parchment">
            <summary className="min-h-11 cursor-pointer content-center font-bold text-gold-bright">
              Lees meer over deze locatie
            </summary>
            <div className="mt-3">
              <LocationStory story={location.story} />
            </div>
          </details>
        )}
        <div
          className={`space-y-5 rounded-3xl border border-gold/40 bg-night-deep/95 p-5 text-parchment ${location.result ? "text-base [&_p]:text-base [&_h1]:text-base [&_h2]:text-base [&_a]:text-base [&_button]:text-base" : ""}`}
        >
          {location.result ? (
            <>
              {type === "quiz" ? (
                <div className="space-y-3">
                  <h2 className="whitespace-pre-line text-xl font-bold">{quiz?.question}</h2>
                  <p className="rounded-xl border border-gold-bright bg-gold/20 p-3">
                    <span className="block text-sm text-parchment/70">Gekozen antwoord</span>
                    {location.result.chosenAnswer ??
                      (selected === null
                        ? location.result.correct
                          ? location.result.correctAnswer
                          : ""
                        : quiz?.answers[selected])}
                    {location.result.correct && (
                      <span className="mt-2 block font-bold text-gold-bright">
                        ✓ Goed geantwoord!
                      </span>
                    )}
                  </p>
                  {!location.result.correct && (
                    <p className="rounded-xl border border-parchment/30 bg-parchment/5 p-3">
                      <span className="block text-sm text-parchment/70">Juiste antwoord</span>
                      {location.result.correctAnswer}
                    </p>
                  )}
                </div>
              ) : (
                <div role="status" className="space-y-3">
                  <h2 className="font-bold text-gold-bright">
                    {petanque
                      ? location.result.correct
                        ? "Proef geslaagd!"
                        : "Minder dan 18 punten: Matthew trakteert."
                      : "Quest afgerond!"}
                  </h2>
                  <p>
                    {type === "score"
                      ? `Je score: ${location.result.score}`
                      : type === "purchase" && !quiz?.bonus
                        ? "Je aankoop is bevestigd."
                        : location.result.correct
                          ? quiz?.bonus
                            ? `Je hebt een ontwikkelingskaart verdiend: ${location.result.bonus}.`
                            : "Je hebt de vraag goed beantwoord."
                          : `Het juiste antwoord is: ${location.result.correctAnswer}`}
                  </p>
                  <p>Deze locatie is afgerond.</p>
                </div>
              )}
              {type !== "quiz" && location.result.correct && location.result.bonus && (
                <RewardAction rewardId={rewardKey(location)} bonus={location.result.bonus} />
              )}
              {type !== "quiz" && location.result.correct && location.result.bonus && (
                <Link className="block underline" href="/development-cards">
                  Bekijk je ontwikkelingskaarten
                </Link>
              )}
              {openedBeforeCompletion &&
              !location.result.correct &&
              (type === "quiz" || petanque) ? (
                <TreatWheel onDone={onClose} />
              ) : (
                <ActionButton fullWidth onClick={onClose}>
                  Naar de map
                </ActionButton>
              )}
            </>
          ) : !location.ready || !quiz ? (
            <>
              <h2 className="text-xl font-bold">{quiz?.question ? "Opdracht" : "Deze locatie"}</h2>
              <p className="whitespace-pre-line">
                {quiz?.question || "De quiz voor deze locatie wordt nog aangevuld."}
              </p>
              <ActionButton fullWidth onClick={onClose}>
                Naar de map
              </ActionButton>
            </>
          ) : type !== "quiz" ? (
            <>
              {type === "score" ? (
                <>
                  <h2 className="font-display text-xl font-bold text-gold-bright">De opdracht</h2>
                  <ScoreInstructions
                    question={petanque ? quiz.question.replace(/>\s*18/g, "≥18") : quiz.question}
                  />
                </>
              ) : (
                <h2 className="whitespace-pre-line text-xl font-bold leading-relaxed">
                  {quiz.question}
                </h2>
              )}
              {type === "score" && (
                <label className="block border-t border-parchment/20 pt-5 font-bold">
                  Behaalde score
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="0"
                    value={score}
                    disabled={busy}
                    className="mt-3 block min-h-16 w-full rounded-xl border-2 border-gold/60 bg-parchment p-4 text-center text-3xl font-bold tabular-nums text-ink outline-none focus:border-gold-bright focus:ring-2 focus:ring-gold-bright/40 disabled:opacity-50"
                    onChange={(event) => setScore(event.target.value)}
                  />
                </label>
              )}
              <ActionButton
                fullWidth
                loading={busy}
                disabled={
                  type === "score" &&
                  (score.trim() === "" || !Number.isSafeInteger(Number(score)) || Number(score) < 0)
                }
                onClick={() => onAnswer(type === "purchase" ? 1 : Number(score))}
              >
                {type === "purchase" ? "Ik heb de aankoop gedaan" : "Bevestig score"}
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
          {!location.result && location.ready && quiz && (
            <ActionButton fullWidth variant="ghost" onClick={onClose}>
              Naar de map
            </ActionButton>
          )}
        </div>
      </div>
    </section>
  );
}
