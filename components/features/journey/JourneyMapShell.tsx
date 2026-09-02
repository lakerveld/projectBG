"use client";

import { Compass, MapPinned, Route, Satellite, Signal } from "lucide-react";
import { ANTWERP_JOURNEY_STATE, getJourneyProgress } from "@/lib/domain/journey";
import { cn } from "@/lib/ui/cn";
import { ParchmentCard } from "@/components/ui/ParchmentCard";

function statusLabel(status: string) {
  switch (status) {
    case "locked":
      return "GPS locked";
    case "manual":
      return "Manual confirm";
    default:
      return "GPS searching";
  }
}

function statusTone(status: string) {
  switch (status) {
    case "locked":
      return "border-forest/40 bg-forest/10 text-forest";
    case "manual":
      return "border-gold/40 bg-gold/10 text-gold";
    default:
      return "border-parchment-edge/60 bg-white/5 text-parchment";
  }
}

export function JourneyMapShell() {
  const route = ANTWERP_JOURNEY_STATE;
  const progress = getJourneyProgress(route);
  const pathPoints = route.locations.map((location) => `${location.pinX},${location.pinY}`).join(" ");

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 overflow-x-hidden px-4 py-5">
      <header className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/80">
            Antwerp Route
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[0.62rem] uppercase tracking-[0.28em]",
              statusTone(route.gpsStatus)
            )}
          >
            <Signal size={12} aria-hidden="true" />
            {statusLabel(route.gpsStatus)}
          </span>
        </div>

        <div className="grid gap-2">
          <h1 className="font-display text-4xl font-bold leading-none text-parchment">
            {route.title}
          </h1>
          <p className="max-w-sm font-body text-sm leading-6 text-parchment/78">
            {route.subtitle}. The map, the next stop, and the GPS signal all live together on one
            walkable screen.
          </p>
        </div>
      </header>

      <ParchmentCard variant="raised" className="overflow-hidden p-0 shadow-glow-lg">
        <div className="relative aspect-[4/5] min-h-[28rem] bg-[#07141b]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(232,191,106,0.18),transparent_0_18%),radial-gradient(circle_at_76%_18%,rgba(109,91,176,0.18),transparent_0_16%),linear-gradient(180deg,rgba(7,20,27,0.9),rgba(5,13,17,0.96))]" />
          <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:1.5rem_1.5rem]" />

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8bf6a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#efe4c9" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <polyline
              points={pathPoints}
              fill="none"
              stroke="url(#routeGlow)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2.5 2"
              opacity="0.8"
            />
          </svg>

          <div className="absolute inset-0">
            {route.locations.map((location, index) => {
              const isCurrent = location.id === route.currentLocationId;
              const isNext = location.id === route.nextLocationId;
              const isComplete = location.status === "completed";

              return (
                <div
                  key={location.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${location.pinX}%`, top: `${location.pinY}%` }}
                >
                  <div
                    className={cn(
                      "absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                      isCurrent
                        ? "border-gold-bright bg-gold-bright/25 shadow-[0_0_0_10px_rgba(200,148,44,0.1)]"
                        : isNext
                          ? "border-parchment bg-parchment/12"
                          : isComplete
                            ? "border-forest bg-forest/15"
                            : "border-parchment/50 bg-[#ffffff10]"
                    )}
                  />
                  <div
                    className={cn(
                      "relative z-10 grid min-w-28 gap-1 rounded-2xl border px-3 py-2 shadow-seal backdrop-blur-[2px]",
                      isCurrent
                        ? "border-gold/50 bg-[#2b2413]/92 text-parchment"
                        : isNext
                          ? "border-parchment-edge/50 bg-[#1c241f]/92 text-parchment"
                          : "border-parchment-edge/25 bg-[#111820]/86 text-parchment/84"
                    )}
                    style={{
                      marginTop: index === 0 ? "-4.25rem" : "-5rem",
                      marginLeft: index % 2 === 0 ? "0.5rem" : "-8rem"
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPinned size={14} className={isCurrent ? "text-gold" : "text-parchment/70"} />
                      <p className="font-display text-[0.64rem] uppercase tracking-[0.24em]">
                        {isCurrent ? "Current" : isNext ? "Next" : "Stop"}
                      </p>
                    </div>
                    <p className="font-display text-sm font-bold leading-tight">{location.name}</p>
                    <p className="font-body text-[0.7rem] leading-4 text-current/72">
                      {location.district}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute left-4 top-4 rounded-full border border-parchment-edge/40 bg-night-deep/70 px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.25em] text-parchment">
            North
          </div>
          <div className="absolute bottom-4 right-4 rounded-full border border-parchment-edge/40 bg-night-deep/70 px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.25em] text-parchment">
            Antwerp
          </div>
          <div className="absolute inset-x-4 top-16 rounded-2xl border border-parchment-edge/25 bg-night-deep/40 px-3 py-2 text-parchment/75 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Satellite size={14} className="text-gold-bright" aria-hidden="true" />
              <p className="font-body text-xs leading-5">{route.gpsMessage}</p>
            </div>
          </div>
        </div>
      </ParchmentCard>

      <div className="grid gap-3">
        <ParchmentCard className="p-4 shadow-parchment">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[0.64rem] uppercase tracking-[0.24em] text-sepia-muted">
                Current location
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-sepia">
                {progress.current?.name}
              </h2>
            </div>
            <span className="rounded-full border border-forest/25 bg-forest/10 px-3 py-1 font-display text-[0.62rem] uppercase tracking-[0.22em] text-forest">
              On route
            </span>
          </div>
          <p className="mt-2 font-body text-sm leading-6 text-sepia/78">
            {progress.current?.note}
          </p>
        </ParchmentCard>

        <ParchmentCard className="p-4 shadow-parchment">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[0.64rem] uppercase tracking-[0.24em] text-sepia-muted">
                Next location
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-sepia">{progress.next?.name}</h2>
            </div>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-display text-[0.62rem] uppercase tracking-[0.22em] text-gold">
              Target
            </span>
          </div>
          <p className="mt-2 font-body text-sm leading-6 text-sepia/78">
            {progress.next?.note}
          </p>
        </ParchmentCard>

        <ParchmentCard className="p-4 shadow-parchment">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-[0.64rem] uppercase tracking-[0.24em] text-sepia-muted">
                Route progress
              </p>
              <p className="mt-1 font-display text-xl font-bold text-sepia">
                {progress.completed} of {progress.total} stops complete
              </p>
            </div>
            <div className="rounded-full border border-parchment-edge/60 bg-[#e6d7b4]/45 px-3 py-2 text-right">
              <p className="font-display text-[0.58rem] uppercase tracking-[0.24em] text-sepia-muted">
                Coverage
              </p>
              <p className="font-display text-lg font-bold text-sepia">{progress.percent}%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {route.locations.map((location) => {
              const isCurrent = location.id === route.currentLocationId;
              const isNext = location.id === route.nextLocationId;

              return (
                <div
                  key={location.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 shadow-carved",
                    isCurrent
                      ? "border-gold/35 bg-gold/10"
                      : isNext
                        ? "border-forest/25 bg-forest/8"
                        : "border-parchment-edge/45 bg-[#e6d7b4]/38"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-sepia">
                      {location.name}
                    </p>
                    <p className="font-body text-xs uppercase tracking-[0.18em] text-sepia-muted">
                      {location.district}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-display text-[0.58rem] uppercase tracking-[0.2em]",
                      isCurrent
                        ? "border-gold/35 bg-gold/10 text-gold"
                        : isNext
                          ? "border-forest/30 bg-forest/10 text-forest"
                          : "border-parchment-edge/50 bg-white/35 text-sepia-muted"
                    )}
                  >
                    <Route size={10} aria-hidden="true" />
                    {isCurrent ? "Current" : isNext ? "Next" : "Queued"}
                  </span>
                </div>
              );
            })}
          </div>
        </ParchmentCard>
      </div>

      <footer className="rounded-2xl border border-parchment-edge/50 bg-[#e6d7b4]/12 px-4 py-3 shadow-carved">
        <div className="flex items-start gap-3">
          <Compass size={16} className="mt-0.5 text-gold-bright" aria-hidden="true" />
          <p className="font-body text-sm leading-6 text-parchment/82">
            Sprint 1 establishes the shell only. Location activation, dice entry, and resource
            updates are still ahead.
          </p>
        </div>
      </footer>
    </section>
  );
}
