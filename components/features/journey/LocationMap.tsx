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
  onSelect,
  onFinale
}: {
  data: JourneyView | null;
  onSelect: (id: string) => void;
  onFinale?: () => void;
}) {
  return (
    <div className="journey-map-artwork relative">
      <Image
        src="/maps/antwerp-six-locations.png"
        alt="Geïllustreerde kaart van Antwerpen met zes genummerde locaties, de Schelde en de kathedraal."
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
            aria-label={`${index + 1}. ${status === "locked" ? `Locatie ${index + 1}` : (location?.name ?? `Locatie ${index + 1}`)} — ${locationStatusLabels[status]}`}
            className={`location-hex absolute z-10 isolate grid cursor-pointer place-items-center transition-colors focus-visible:bg-white/35 focus-visible:outline-none ${unlocked ? "location-hex-unlocked bg-lime-300/20 text-lime-200 hover:bg-lime-300/35" : status === "completed" ? "text-emerald-200" : "bg-night-deep/30 text-parchment/80 hover:bg-white/15"}`}
            style={{
              left: `${pin.x - pin.w / 2}%`,
              top: `${pin.y - pin.h / 2}%`,
              width: `${pin.w}%`,
              height: `${pin.h}%`,
              clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)"
            }}
          >
            {status === "completed" && location?.image && (
              <Image
                src={location.image}
                alt=""
                fill
                sizes="24vw"
                className="pointer-events-none -z-10 object-cover"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute top-[10%] rounded-full bg-night-deep/80 px-2 font-display text-xl font-bold text-gold-bright sm:text-3xl"
            >
              {index + 1}
            </span>
            <span
              className={`mt-3 rounded-full border bg-night-deep/90 p-2 shadow-lg ${unlocked ? "border-lime-200 shadow-[0_0_14px_#c5ff30]" : "border-current"}`}
            >
              <Icon className="size-5 sm:size-7" aria-hidden="true" />
            </span>
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
      {onFinale && (
        <button
          type="button"
          onClick={onFinale}
          aria-label="Bekijk de finale"
          title="Bekijk de finale"
          className="location-hex absolute bottom-[3%] left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 cursor-pointer place-items-center bg-night-deep/80 text-gold-bright hover:bg-night-deep focus-visible:bg-gold/40 focus-visible:outline-none"
          style={{ clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }}
        >
          <span aria-hidden="true" className="text-3xl">
            🏁
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 size-full"
            fill="none"
          >
            <polygon
              points="50,2 98,26 98,74 50,98 2,74 2,26"
              stroke="currentColor"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
