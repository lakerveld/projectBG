"use client";

import Image from "next/image";
import { LockKeyhole, UnlockKeyhole, Check, Play } from "lucide-react";
import { locationPins, type JourneyView } from "@/lib/domain/locationGame";

export const locationStatusLabels = {
  locked: "Op slot",
  available: "Beschikbaar",
  started: "Quiz hervatten",
  completed: "Afgerond"
};

export function LocationMap({
  data,
  onSelect
}: {
  data: JourneyView | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative">
      <Image
        src="/maps/antwerp-journey.png"
        alt="Geïllustreerde kaart van Antwerpen met acht genummerde locaties, de Schelde en de kathedraal."
        width={941}
        height={1672}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
      {locationPins.map((pin, index) => {
        const location = data?.locations[index];
        const status = location?.status ?? "locked";
        const unlocked = status === "available" || status === "started";
        const artwork = status === "completed" && index === 0 ? "/locations/bierpaleis.png" : null;
        const Icon = {
          locked: LockKeyhole,
          available: UnlockKeyhole,
          started: Play,
          completed: Check
        }[status];
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(String(index + 1))}
            aria-label={`${index + 1}. ${location?.name ?? `Locatie ${index + 1}`} — ${locationStatusLabels[status]}`}
            className={`location-hex absolute isolate grid place-items-center transition-colors focus-visible:bg-white/35 focus-visible:outline-none ${unlocked ? "location-hex-unlocked bg-lime-300/20 text-lime-200 hover:bg-lime-300/35" : status === "completed" ? "text-emerald-200" : "bg-night-deep/30 text-parchment/80 hover:bg-white/15"}`}
            style={{
              left: `${pin.x - pin.w / 2}%`,
              top: `${pin.y - pin.h / 2}%`,
              width: `${pin.w}%`,
              height: `${pin.h}%`,
              clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)"
            }}
          >
            {artwork ? (
              <>
                <Image src={artwork} alt="" fill sizes="20vw" className="-z-10 object-cover" />
                <span
                  aria-hidden="true"
                  className="absolute top-[9%] rounded-full bg-night-deep/85 px-1.5 text-xs font-bold text-gold-bright sm:text-lg"
                >
                  {index + 1}
                </span>
                <span className="absolute bottom-[12%] rounded-full border border-emerald-200 bg-night-deep/90 p-1">
                  <Check className="size-3 sm:size-4" aria-hidden="true" />
                </span>
              </>
            ) : (
              <span
                className={`mt-3 rounded-full border bg-night-deep/90 p-2 shadow-lg ${unlocked ? "border-lime-200 shadow-[0_0_14px_#c5ff30]" : "border-current"}`}
              >
                <Icon className="size-5 sm:size-7" aria-hidden="true" />
              </span>
            )}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full overflow-visible"
              fill="none"
            >
              <polygon
                className={`location-hex-outline ${unlocked ? "location-hex-neon" : status === "completed" ? "stroke-emerald-200" : "stroke-transparent"}`}
                points="50,2 98,26 98,74 50,98 2,74 2,26"
                strokeWidth={unlocked ? 3 : 2}
                vectorEffect="non-scaling-stroke"
              />
              {unlocked && (
                <polygon
                  className="location-hex-trail"
                  points="50,2 98,26 98,74 50,98 2,74 2,26"
                  pathLength="100"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
