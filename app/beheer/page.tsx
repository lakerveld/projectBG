"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ParchmentCard } from "@/components/ui/ParchmentCard";
import { locationStatusLabels } from "@/components/features/journey/LocationMap";
import type { JourneyView } from "@/lib/domain/locationGame";

export default function BeheerPage() {
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [data, setData] = useState<JourneyView | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  const mutating = useRef(false);

  useEffect(() => {
    if (!credential) return;
    let alive = true;
    async function refresh() {
      if (mutating.current || document.hidden) return;
      const requestVersion = ++version.current;
      try {
        const response = await fetch("/api/journey/admin", {
          headers: { Authorization: `Bearer ${credential}` },
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
          setError("Status verversen mislukt. Controleer de verbinding of meld opnieuw aan.");
      }
    }
    const timer = setInterval(() => {
      void refresh();
    }, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [credential]);

  async function request(secret: string, id?: string) {
    if (mutating.current) return;
    mutating.current = true;
    ++version.current;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/journey/admin", {
        method: id ? "POST" : "GET",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        ...(id ? { body: JSON.stringify({ id, action: "unlock" }) } : {}),
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.error);
      setData(next);
      setCredential(secret);
      setPassword("");
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
        {!credential ? (
          <ParchmentCard className="p-5">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void request(password);
              }}
            >
              <label className="block font-bold">
                Beheerwachtwoord
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-lg border-2 border-ink bg-white p-3 text-ink"
                />
              </label>
              <ActionButton type="submit" fullWidth loading={busy}>
                Aanmelden
              </ActionButton>
            </form>
          </ParchmentCard>
        ) : (
          <>
            <ActionButton
              variant="iron"
              disabled={busy}
              onClick={() => {
                ++version.current;
                setCredential("");
                setData(null);
                setMessage("");
                setError("");
              }}
            >
              Uitloggen
            </ActionButton>
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
                        Quiz nog niet ingevuld in content/locatiequizzen.md.
                      </p>
                    )}
                    {location.status === "locked" && (
                      <ActionButton
                        fullWidth
                        disabled={!location.ready || busy}
                        onClick={() => {
                          void request(credential, location.id);
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
          </>
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
