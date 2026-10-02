"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { locationStatusLabels } from "@/components/features/journey/LocationMap";
import type { AdminJourneyView, LocationQuizContent } from "@/lib/domain/locationGame";
import { applyJourneyReset } from "@/lib/ui/journeyReset";

export default function BeheerPage() {
  const [data, setData] = useState<AdminJourneyView | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<LocationQuizContent | null>(null);
  const version = useRef(0);
  const mutating = useRef(false);

  useEffect(() => {
    let alive = true;
    let reading = false;
    async function refresh() {
      if (mutating.current || reading || document.hidden) return;
      reading = true;
      const requestVersion = ++version.current;
      try {
        const response = await fetch("/api/journey/admin", {
          cache: "no-store",
          signal: AbortSignal.timeout(10000)
        });
        const next = await response.json();
        if (!response.ok) throw new Error(next.error);
        if (alive && version.current === requestVersion) {
          setData(next);
          setError("");
        }
      } catch {
        if (alive && version.current === requestVersion)
          setError("Status verversen mislukt. Controleer de verbinding.");
      } finally {
        reading = false;
      }
    }
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  async function request(id?: string, action: "unlock" | "lock" | "reset" | "save" = "unlock") {
    if (mutating.current) return;
    mutating.current = true;
    ++version.current;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/journey/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, ...(action === "save" ? { content: draft } : {}) }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.error);
      setData(next);
      if (action === "save") {
        setEditing(null);
        setDraft(null);
        setMessage("Quiz opgeslagen. Vrijgegeven locaties blijven beschikbaar.");
      } else if (action === "reset") {
        applyJourneyReset(next.resetId);
        setEditing(null);
        setDraft(null);
        setMessage(
          "Spel gereset. Alle locaties staan op slot; antwoorden, grondstoffen en ontwikkelingskaarten zijn gewist. Andere telefoons nemen de reset over zodra ze verbinding maken."
        );
      } else if (action === "lock") setMessage(`Locatie ${id} staat weer op slot.`);
      else if (id)
        setMessage(`Locatie ${id} is vrijgegeven. Matthew krijgt een melding in de geopende app.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verbinding mislukt.");
    } finally {
      setBusy(false);
      mutating.current = false;
    }
  }

  return (
    <main lang="nl" className="hall min-h-dvh px-5 py-8">
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-3xl font-bold">Locatiebeheer</h1>
        <p>
          Geef iedere locatie vrij zodra jullie zijn aangekomen, ook als de quiz nog niet klaar is.
          Matthew ziet dan de locatie en kan een complete quiz starten.
        </p>
        {!data && !error && <p>Locaties laden…</p>}
        <ul className="space-y-4">
          {data?.locations.map((location) => (
            <li key={location.id}>
              <ParchmentCard className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold">
                    {location.id}. {location.name}
                  </h2>
                  <span className="rounded border border-ink px-2 py-1 text-xs font-bold">
                    {locationStatusLabels[location.status]}
                  </span>
                </div>
                {!location.ready && (
                  <p className="text-sm">
                    Quiz nog niet compleet. Je kunt de locatie al vrijgeven; vul de quiz later aan
                    via Quiz bewerken.
                  </p>
                )}
                <ActionButton
                  role="switch"
                  aria-checked={location.status !== "locked"}
                  aria-label={`Locatie ${location.id} vrijgeven`}
                  variant={location.status === "locked" ? "iron" : "royal"}
                  fullWidth
                  disabled={busy}
                  onClick={() => {
                    void request(location.id, location.status === "locked" ? "unlock" : "lock");
                  }}
                >
                  {location.status === "locked"
                    ? "Uit · locatie op slot"
                    : "Aan · locatie vrijgegeven"}
                </ActionButton>
                {editing === location.id && draft ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (
                        location.status !== "locked" &&
                        !window.confirm(
                          "Quiz opslaan? Een bestaand antwoord en de bijbehorende kaart worden gewist. De locatie blijft vrijgegeven."
                        )
                      )
                        return;
                      void request(location.id, "save");
                    }}
                  >
                    <label className="block text-sm font-bold">
                      Questtype
                      <select
                        className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                        value={draft.type ?? "quiz"}
                        disabled={busy}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            type: event.target.value as LocationQuizContent["type"]
                          })
                        }
                      >
                        <option value="quiz">Vraag</option>
                        <option value="purchase">Koopopdracht</option>
                        <option value="score">Score invullen</option>
                      </select>
                    </label>
                    {(
                      [
                        ["name", "Naam"],
                        ["story", "Verhaal"],
                        ["question", "Vraag / opdracht"],
                        ["bonus", "Beloning / ontwikkelingskaart"]
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="block text-sm font-bold">
                        {label}
                        <textarea
                          className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                          value={draft[key] ?? ""}
                          required={key === "name"}
                          maxLength={key === "name" ? 200 : key === "story" ? 5000 : 2000}
                          rows={key === "story" || key === "question" ? 3 : 1}
                          disabled={busy}
                          onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                        />
                      </label>
                    ))}
                    {(!draft.type || draft.type === "quiz") && (
                      <>
                        {draft.answers.map((answer, index) => (
                          <label key={index} className="block text-sm font-bold">
                            Antwoord {String.fromCharCode(65 + index)}
                            <input
                              className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                              value={answer}
                              maxLength={2000}
                              disabled={busy}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  answers: draft.answers.map((value, i) =>
                                    i === index ? event.target.value : value
                                  )
                                })
                              }
                            />
                          </label>
                        ))}
                        <label className="block text-sm font-bold">
                          Correct antwoord
                          <select
                            className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                            value={draft.correct}
                            disabled={busy}
                            onChange={(event) =>
                              setDraft({ ...draft, correct: Number(event.target.value) })
                            }
                          >
                            <option value={-1}>Nog niet gekozen</option>
                            {[0, 1, 2, 3].map((index) => (
                              <option key={index} value={index}>
                                {String.fromCharCode(65 + index)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </>
                    )}
                    <p className="text-sm">
                      Opslaan wist een eventueel quizresultaat. De locatie blijft vrijgegeven. Een
                      onvolledige quiz kun je als concept bewaren.
                    </p>
                    <ActionButton type="submit" fullWidth disabled={busy}>
                      Quiz opslaan
                    </ActionButton>
                    <ActionButton
                      type="button"
                      variant="ghost"
                      fullWidth
                      disabled={busy}
                      onClick={() => {
                        setEditing(null);
                        setDraft(null);
                      }}
                    >
                      Annuleren
                    </ActionButton>
                  </form>
                ) : (
                  <ActionButton
                    variant="iron"
                    fullWidth
                    disabled={busy || editing !== null}
                    onClick={() => {
                      setEditing(location.id);
                      setDraft({ ...location.content, answers: [...location.content.answers] });
                    }}
                  >
                    Quiz bewerken
                  </ActionButton>
                )}
                {location.result && (
                  <p>
                    {location.result.correct
                      ? "Goed beantwoord · kaart verdiend"
                      : "Afgerond zonder kaart"}
                  </p>
                )}
              </ParchmentCard>
            </li>
          ))}
        </ul>
        {data && (
          <ParchmentCard className="space-y-3 p-5">
            <h2 className="text-xl font-bold">Opnieuw beginnen</h2>
            <p>
              Zet alle locaties op slot en wis alle antwoorden, grondstoffen en
              ontwikkelingskaarten. De ingestelde vragen en opdrachten blijven bewaard. Andere
              telefoons nemen de reset over zodra ze de app met verbinding openen. Dit kan niet
              ongedaan worden gemaakt.
            </p>
            <ActionButton
              variant="ember"
              fullWidth
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Het hele spel resetten? Alle locaties gaan op slot en alle antwoorden, grondstoffen en ontwikkelingskaarten worden gewist. Dit kan niet ongedaan worden gemaakt."
                  )
                )
                  void request(undefined, "reset");
              }}
            >
              Spel resetten
            </ActionButton>
          </ParchmentCard>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-ember bg-night p-4 text-parchment">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="rounded-xl bg-gold-bright p-4 font-bold text-ink">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
