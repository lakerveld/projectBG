"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { locationStatusLabels } from "@/components/features/journey/LocationMap";
import type { JourneyView } from "@/lib/domain/locationGame";

export default function BeheerPage() {
  const [data, setData] = useState<JourneyView | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
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

  async function request(id: string) {
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
        body: JSON.stringify({ id, action: "unlock" }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.error);
      setData(next);
      if (id)
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
                  <p className="text-sm">Quiz nog niet ingevuld in content/locatiequizzen.md.</p>
                )}
                {location.status === "locked" && (
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
