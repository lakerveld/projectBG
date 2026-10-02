"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/ui/ActionButton";
import { resourceColors } from "@/lib/ui/resourceColors";

const people = ["Levi", "Jordi", "Matthew", "Argyle", "Dennis"];
const wheelPeople = [...people, ...people];
const wheelSlices = wheelPeople.map((name, index) => {
  const start = wheelPeople
    .slice(0, index)
    .reduce((sum, person) => sum + (person === "Matthew" ? 99 : 20.25), 0);
  const end = start + (name === "Matthew" ? 99 : 20.25);
  return { start, end, center: (start + end) / 2 };
});
const treats = ["Bier", "Nakkie", "Salmari shot"];
const treatColors = [resourceColors.Gerst, resourceColors.Sneeuw, resourceColors.Salmari];
const colors = ["#ff91c4", "#c681f5", "#dfff00", "#89dccc", "#ffb66e"];
const SPIN_MS = 8000;

function portrait(name: string) {
  if (name === "Matthew") return "/rattenrad/matthew-avatar.png";
  return name === "Jordi" || name === "Argyle" || name === "Levi" || name === "Dennis"
    ? `/rattenrad/${name.toLowerCase()}-avatar.png`
    : `/rattenrad/${name.toLowerCase()}.svg`;
}

export function TreatWheel({ onDone }: { onDone?: () => void }) {
  return <Rattenrad forcedMatthew onDone={onDone} />;
}

export function Rattenrad({
  forcedMatthew = false,
  onDone
}: {
  forcedMatthew?: boolean;
  onDone?: () => void;
}) {
  const [person, setPerson] = useState<number | null>(forcedMatthew ? 2 : null);
  const [treat, setTreat] = useState<number | null>(null);
  const [phase, setPhase] = useState<"who" | "what" | "done">(forcedMatthew ? "what" : "who");
  const [spinning, setSpinning] = useState(false);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  function spin() {
    if (busy.current || (phase !== "who" && !(forcedMatthew && phase === "what"))) return;
    busy.current = true;
    setSpinning(true);
    if (forcedMatthew) {
      const draw = Math.random();
      setTreat(draw < 0.4 ? 0 : draw < 0.8 ? 1 : 2);
      timer.current = setTimeout(
        () => {
          setPhase("done");
          setSpinning(false);
          busy.current = false;
        },
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : SPIN_MS
      );
      return;
    }
    const draw = Math.random();
    setPerson(wheelSlices.findIndex((slice) => draw < slice.end / 360));
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(
      () => {
        const treatDraw = Math.random();
        setTreat(treatDraw < 0.4 ? 0 : treatDraw < 0.8 ? 1 : 2);
        setPhase("what");
        const finish = () => {
          setPhase("done");
          setSpinning(false);
          busy.current = false;
        };
        if (reduced) finish();
        else timer.current = setTimeout(finish, SPIN_MS);
      },
      reduced ? 0 : SPIN_MS
    );
  }

  const Container = forcedMatthew ? "div" : "main";
  const stop = 3 * 18 + (treat ?? 0);
  return (
    <Container
      lang="nl"
      className={forcedMatthew ? "text-parchment" : "hall min-h-dvh px-4 py-6 text-parchment"}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {!forcedMatthew && (
          <Link href="/journey" className="inline-flex min-h-11 items-center font-bold">
            ← Naar de map
          </Link>
        )}
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-bright">
            {forcedMatthew ? "Fout antwoord? Matthew trakteert." : "Twee draaien. Het lot beslist."}
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            Het rattenrad
          </h1>
        </header>
        <section
          className={`ratten-stage ${spinning ? "ratten-spinning" : ""} ${phase === "done" ? "ratten-settled" : ""} px-3 py-7 text-center text-white sm:p-8`}
        >
          <div className="dice-vortex" aria-hidden="true" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#d5fa55]">
            🐀 Rattan rat club
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
            {phase === "done"
              ? "Het lot heeft gesproken"
              : phase === "who"
                ? "Wie ontsnapt aan het rad?"
                : "Wat wordt de traktatie?"}
          </h2>
          {phase === "who" ? (
            <>
              <div
                className="ratten-wheel relative mx-auto my-10 aspect-square w-full max-w-[560px]"
                aria-hidden="true"
              >
                <span className="ratten-pointer absolute -top-6 left-1/2 z-10 -translate-x-1/2 text-5xl text-[#d5fa55]">
                  ▼
                </span>
                <div
                  className="relative h-full w-full overflow-hidden rounded-full border-4 border-ink shadow-seal transition-transform duration-[8000ms] ease-[cubic-bezier(0.12,0.65,0.15,1)] motion-reduce:transition-none"
                  style={{
                    background: `conic-gradient(${wheelSlices.map((slice, i) => `${colors[i % colors.length]} ${slice.start}deg ${slice.end - 0.6}deg, #302039 ${slice.end - 0.6}deg ${slice.end}deg`).join(",")})`,
                    transform: `rotate(${person === null ? 0 : 360 * 9 + 360 - wheelSlices[person].center}deg)`
                  }}
                >
                  {wheelPeople.map((name, i) => {
                    const angle = (wheelSlices[i].center * Math.PI) / 180;
                    return (
                      <div
                        key={`${name}-${i}`}
                        className="absolute flex w-[13%] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                        style={{
                          left: `${50 + 37 * Math.sin(angle)}%`,
                          top: `${50 - 37 * Math.cos(angle)}%`
                        }}
                      >
                        <Image
                          src={portrait(name)}
                          alt=""
                          width={96}
                          height={96}
                          sizes="(max-width: 640px) 13vw, 73px"
                          className="aspect-square w-full rounded-full border-2 border-ink object-cover shadow-md ring-2 ring-parchment/80"
                        />
                        <span className="mt-1 rounded-full bg-parchment/95 px-1.5 py-0.5 text-[9px] font-bold leading-tight text-ink sm:text-xs">
                          {name}
                        </span>
                      </div>
                    );
                  })}
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d5fa55] bg-[#130b29] p-3 text-3xl shadow-[0_0_30px_#d5fa5580] sm:p-5 sm:text-4xl">
                    🐀
                  </span>
                </div>
              </div>
              <p className="mb-4 text-xs uppercase tracking-widest text-white/70">
                {people.join(" · ")}
              </p>
            </>
          ) : (
            <>
              <div className="ratten-winner my-8 flex flex-col items-center justify-center gap-5">
                <Image
                  src={portrait(wheelPeople[person!])}
                  alt={`Portret van ${wheelPeople[person!]}`}
                  width={256}
                  height={256}
                  sizes="(max-width: 640px) 192px, 256px"
                  className="ratten-portrait h-48 w-48 rounded-3xl border-4 border-[#d5fa55] object-cover sm:h-64 sm:w-64"
                />
                <p className="text-3xl font-black text-[#d5fa55] sm:text-4xl">
                  {wheelPeople[person!]} trakteert!
                </p>
              </div>
              <div
                aria-hidden="true"
                className="relative my-5 h-24 overflow-hidden rounded-xl border-2 border-[#ff91c4] bg-arcane text-ink shadow-[0_0_30px_#ff41b540]"
              >
                <div
                  key={treat ?? "idle"}
                  className={treat === null ? "" : "robber-reel"}
                  style={
                    { "--reel-stop": `-${stop * 6}rem`, animationDuration: "8s" } as CSSProperties
                  }
                >
                  {Array.from({ length: stop + 2 }, (_, i) => (
                    <div
                      key={i}
                      className="flex h-24 items-center justify-center text-2xl font-bold"
                      style={{ background: treatColors[i % treatColors.length] }}
                    >
                      {treats[i % 3]}
                    </div>
                  ))}
                </div>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xl">▸</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl">◂</span>
              </div>
            </>
          )}
          <p
            role="status"
            aria-live="polite"
            className="mb-5 min-h-7 text-lg font-bold text-[#ff91c4]"
          >
            {spinning
              ? "Het rad draait…"
              : phase === "done"
                ? `${wheelPeople[person!]} trakteert op ${treats[treat!]}!`
                : forcedMatthew
                  ? "Draai om je traktatie te bepalen."
                  : "Wie wordt het deze keer?"}
          </p>
          {phase === "done" ? (
            <ActionButton
              fullWidth
              size="lg"
              onClick={() => {
                if (forcedMatthew) {
                  onDone?.();
                  return;
                }
                setPerson(null);
                setTreat(null);
                setPhase("who");
              }}
            >
              {forcedMatthew ? "Naar de map" : "Nog een ronde"}
            </ActionButton>
          ) : phase === "who" ? (
            <ActionButton fullWidth size="lg" disabled={spinning} onClick={spin}>
              {spinning ? "Even geduld…" : "Draai voor wie"}
            </ActionButton>
          ) : forcedMatthew ? (
            <ActionButton fullWidth size="lg" disabled={spinning} onClick={spin}>
              {spinning ? "Even geduld…" : "Draai voor de traktatie"}
            </ActionButton>
          ) : null}
        </section>
      </div>
    </Container>
  );
}
