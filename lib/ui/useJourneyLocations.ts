"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JourneyView } from "@/lib/domain/locationGame";

export function useJourneyLocations() {
  const [data, setData] = useState<JourneyView | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  const mutating = useRef(false);
  const reading = useRef(false);
  const mounted = useRef(false);
  const seen = useRef<Set<string> | null>(null);

  const accept = useCallback((next: JourneyView) => {
    if (seen.current === null) {
      try {
        seen.current = new Set(JSON.parse(localStorage.getItem("rattan-location-notices") ?? "[]"));
      } catch {
        seen.current = new Set();
      }
    }
    const fresh = next.locations.filter(
      (item) => item.unlockedAt && !seen.current!.has(`${item.id}:${item.unlockedAt}`)
    );
    if (fresh.length) {
      setNotice(`Nieuwe locatie ontgrendeld: ${fresh.map((item) => item.name).join(", ")}!`);
      try {
        navigator.vibrate?.([180, 80, 180]);
      } catch {
        /* Optional device capability. */
      }
    }
    next.locations.forEach((item) => {
      if (item.unlockedAt) seen.current!.add(`${item.id}:${item.unlockedAt}`);
    });
    try {
      localStorage.setItem("rattan-location-notices", JSON.stringify([...seen.current]));
    } catch {
      /* Keep session notices. */
    }
    setData(next);
    setError("");
  }, []);

  const refresh = useCallback(async () => {
    if (mutating.current || reading.current) return;
    reading.current = true;
    const requestVersion = ++version.current;
    try {
      const response = await fetch("/api/journey", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.error);
      if (mounted.current && requestVersion === version.current) accept(next);
    } catch {
      if (mounted.current && requestVersion === version.current)
        setError("Geen verbinding met de locaties. We proberen het opnieuw.");
    } finally {
      reading.current = false;
    }
  }, [accept]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 5000);
    const resume = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
    };
  }, [refresh]);

  async function command(id: string, action: "start" | "answer", answer?: number) {
    if (mutating.current) return null;
    mutating.current = true;
    ++version.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, answer }),
        signal: AbortSignal.timeout(10000)
      });
      const next = await response.json();
      if (!response.ok) throw new Error(next.error || "Opslaan mislukt.");
      accept(next);
      return next as JourneyView;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Opslaan mislukt. Probeer opnieuw.");
      return null;
    } finally {
      mutating.current = false;
      setBusy(false);
    }
  }

  return { data, error, notice, busy, command, refresh, dismissNotice: () => setNotice("") };
}
