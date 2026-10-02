"use client";

import Image from "next/image";
import { Crown, Heart, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

export function JourneyFinale({ onContinue }: { onContinue: () => void }) {
  return (
    <section
      lang="nl"
      aria-label="De reünie van Rattan"
      className="finale-scene relative isolate min-h-dvh overflow-hidden bg-[#100b24] text-parchment"
    >
      <div className="absolute inset-0 -z-20">
        <Image
          src="/rewards/rattan-reunion.png"
          alt="Rat Matthew omhelst samen met de kleine blonde rat Jade hun kind Ratthew, onder een gouden sterrenhemel boven Antwerpen."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#100b24]/65 via-transparent to-[#100b24]" />
      <div className="finale-stars pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-dvh max-w-xl flex-col items-center px-6 pb-8 pt-10 text-center sm:pt-14">
        <div className="finale-arrival flex flex-col items-center">
          <Crown size={40} className="mb-3 text-gold-bright" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-bright">
            Alle locaties voltooid
          </p>
          <h1
            tabIndex={-1}
            ref={(node) => node?.focus()}
            className="mt-3 font-display text-5xl font-bold leading-none text-parchment outline-none sm:text-6xl"
          >
            Weer samen.
          </h1>
          <p className="mt-3 font-display text-sm tracking-widest text-parchment">
            Matthew · Jade · Ratthew
          </p>
        </div>
        <div className="min-h-[42dvh] flex-1" />
        <div className="finale-arrival w-full rounded-3xl border border-gold/40 bg-[#100b24]/85 p-6 shadow-[0_0_60px_#d5a33825] backdrop-blur-md">
          <div
            className="mb-3 flex items-center justify-center gap-3 text-gold-bright"
            aria-hidden="true"
          >
            <Sparkles size={18} />
            <Heart size={25} />
            <Sparkles size={18} />
          </div>
          <h2 className="font-display text-2xl font-bold text-gold-bright">
            Het mooiste goud is thuiskomen.
          </h2>
          <p className="mt-4 font-body leading-relaxed">
            Alle sporen gevolgd. Alle locaties bezocht. Na een tocht door Rattan sluit Matthew Jade
            en Ratthew eindelijk weer in zijn armen.
          </p>
          <p className="mb-6 mt-3 font-body leading-relaxed text-parchment/80">
            De handelsroute eindigt hier. Jullie verhaal gaat verder. Samen.
          </p>
          <ActionButton fullWidth size="lg" onClick={onContinue}>
            Naar de map
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
