"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { locationStatusLabels } from "@/components/features/journey/LocationMap";
import type { AdminJourneyView, LocationQuizContent } from "@/lib/domain/locationGame";

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

  async function request(id?: string, action: "unlock" | "reset" | "save" = "unlock") {
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
        setMessage("Quiz opgeslagen. De locatie staat op slot en kan worden vrijgegeven zodra de quiz compleet is.");
      } else if (action === "reset")
        setMessage("Alle locaties zijn gereset. Je kunt ze opnieuw vrijgeven.");
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
          Geef een locatie vrij zodra jullie zijn aangekomen. Matthew kan daarna de quiz starten.
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
                  <p className="text-sm">Quiz nog niet compleet. Kies Quiz bewerken om deze aan te vullen.</p>
                )}
                {editing === location.id && draft ? (
                  <form className="space-y-3" onSubmit={(event) => {
                    event.preventDefault();
                    if (location.status !== "locked" && !window.confirm("Quiz opslaan? Deze locatie gaat terug op slot. Een bestaand antwoord en de bijbehorende kaart worden gewist.")) return;
                    void request(location.id, "save");
                  }}>
                    {([
                      ["name", "Naam"], ["time", "Tijd"], ["story", "Verhaal"],
                      ["question", "Vraag"], ["bonus", "Beloning / ontwikkelingskaart"]
                    ] as const).map(([key, label]) => (
                      <label key={key} className="block text-sm font-bold">
                        {label}
                        <textarea
                          className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                          value={draft[key] ?? ""}
                          required={key === "name"}
                          maxLength={key === "name" || key === "time" ? 200 : key === "story" ? 5000 : 2000}
                          rows={key === "story" || key === "question" ? 3 : 1}
                          disabled={busy}
                          onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                        />
                      </label>
                    ))}
                    {draft.answers.map((answer, index) => (
                      <label key={index} className="block text-sm font-bold">
                        Antwoord {String.fromCharCode(65 + index)}
                        <input className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                          value={answer} maxLength={2000} disabled={busy}
                          onChange={(event) => setDraft({ ...draft, answers: draft.answers.map((value, i) => i === index ? event.target.value : value) })} />
                      </label>
                    ))}
                    <label className="block text-sm font-bold">
                      Correct antwoord
                      <select className="mt-1 block w-full rounded border border-ink bg-white p-2 text-ink"
                        value={draft.correct} disabled={busy}
                        onChange={(event) => setDraft({ ...draft, correct: Number(event.target.value) })}>
                        <option value={-1}>Nog niet gekozen</option>
                        {[0, 1, 2, 3].map((index) => <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>)}
                      </select>
                    </label>
                    <p className="text-sm">Opslaan zet deze locatie op slot en wist een eventueel quizresultaat. Een onvolledige quiz kun je als concept bewaren.</p>
                    <ActionButton type="submit" fullWidth disabled={busy}>Quiz opslaan</ActionButton>
                    <ActionButton type="button" variant="ghost" fullWidth disabled={busy} onClick={() => { setEditing(null); setDraft(null); }}>Annuleren</ActionButton>
                  </form>
                ) : (
                  <ActionButton variant="iron" fullWidth disabled={busy || editing !== null}
                    onClick={() => { setEditing(location.id); setDraft({ ...location.content, answers: [...location.content.answers] }); }}>
                    Quiz bewerken
                  </ActionButton>
                )}
                {location.status === "locked" && editing !== location.id && (
                  <ActionButton
                    fullWidth
                    disabled={!location.ready || busy}
                    onClick={() => {
                      void request(location.id);
                    }}
                  >
                    Locatie vrijgeven
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
              Zet alle locaties weer op slot en wis alle antwoorden en verdiende quizkaarten. Dit
              geldt voor iedereen en kan niet ongedaan worden gemaakt.
            </p>
            <ActionButton
              variant="ember"
              fullWidth
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Alle locaties resetten? Alle antwoorden en verdiende quizkaarten worden gewist en alle locaties gaan weer op slot. Dit kan niet ongedaan worden gemaakt."
                  )
                )
                  void request(undefined, "reset");
              }}
            >
              Alle locaties resetten
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
