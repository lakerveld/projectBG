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
            className={`absolute grid place-items-center transition-colors focus-visible:bg-white/35 focus-visible:outline-none ${status === "available" || status === "started" ? "bg-gold/20 text-gold-bright hover:bg-gold/40" : status === "completed" ? "bg-emerald-500/20 text-emerald-200" : "bg-night-deep/30 text-parchment/80 hover:bg-white/15"}`}
            style={{
              left: `${pin.x - pin.w / 2}%`,
              top: `${pin.y - pin.h / 2}%`,
              width: `${pin.w}%`,
              height: `${pin.h}%`,
              clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)"
            }}
          >
            <span className="mt-3 rounded-full border border-current bg-night-deep/85 p-2 shadow-lg">
              <Icon className="size-5 sm:size-7" aria-hidden="true" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
