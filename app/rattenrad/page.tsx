"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/ui/ActionButton";

const people = ["Levi", "Jordi", "Matthew", "Argyle", "Dennis"];
const wheelPeople = [...people, ...people];
const wheelSlices = wheelPeople.map((name, index) => {
  const start = wheelPeople
    .slice(0, index)
    .reduce((sum, person) => sum + (person === "Matthew" ? 72 : 27), 0);
  const end = start + (name === "Matthew" ? 72 : 27);
  return { start, end, center: (start + end) / 2 };
});
const treats = ["Bier", "Nakkie", "Salmari shot"];
const colors = ["#ff91c4", "#c681f5", "#dfff00", "#89dccc", "#ffb66e"];
const SPIN_MS = 8000;

export default function RattenradPage() {
  const [person, setPerson] = useState<number | null>(null);
  const [treat, setTreat] = useState<number | null>(null);
  const [phase, setPhase] = useState<"who" | "what" | "done">("who");
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
    if (busy.current || phase !== "who") return;
    busy.current = true;
    setSpinning(true);
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

  const stop = 3 * 18 + (treat ?? 0);
  return (
    <main lang="nl" className="hall min-h-dvh px-4 py-6 text-parchment">
      <div className="mx-auto max-w-lg space-y-6">
        <Link href="/journey" className="inline-flex min-h-11 items-center font-bold">
          ← Naar de map
        </Link>
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-bright">
            Twee draaien. Het lot beslist.
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">Het rattenrad</h1>
        </header>
        <section className="rounded-3xl border-2 border-ink bg-parchment p-5 text-center text-ink shadow-parchment">
          <h2 className="font-display text-2xl font-bold">
            {phase === "who" ? "1. Wie trakteert?" : "2. Wat wordt de traktatie?"}
          </h2>
          {phase === "who" ? (
            <>
              <div
                className="relative mx-auto my-7 aspect-square w-full max-w-80"
                aria-hidden="true"
              >
                <span className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 text-4xl text-ink">
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
                        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                        style={{
                          left: `${50 + 37 * Math.sin(angle)}%`,
                          top: `${50 - 37 * Math.cos(angle)}%`
                        }}
                      >
                        <Image
                          src={`/rattenrad/${name.toLowerCase()}.svg`}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-ink"
                        />
                        <span className="mt-1 text-[10px] font-bold">{name}</span>
                      </div>
                    );
                  })}
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-parchment p-3 text-2xl">
                    🐀
                  </span>
                </div>
              </div>
              <p className="mb-4 text-sm">{people.join(" · ")}</p>
            </>
          ) : (
            <>
              <div className="my-5 flex items-center justify-center gap-3">
                <Image
                  src={`/rattenrad/${wheelPeople[person!].toLowerCase()}.svg`}
                  alt={`Placeholderportret van ${wheelPeople[person!]}`}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-ink"
                />
                <p className="text-xl font-bold">{wheelPeople[person!]} trakteert!</p>
              </div>
              <div
                aria-hidden="true"
                className="relative my-5 h-24 overflow-hidden rounded-xl border-2 border-ink bg-arcane"
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
                      style={{ background: colors[i % 3] }}
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
          <p role="status" aria-live="polite" className="mb-4 min-h-7 font-bold">
            {spinning
              ? "Het rad draait…"
              : phase === "done"
                ? `${wheelPeople[person!]} trakteert op ${treats[treat!]}!`
                : "Wie wordt het deze keer?"}
          </p>
          {phase === "done" ? (
            <ActionButton
              fullWidth
              size="lg"
              onClick={() => {
                setPerson(null);
                setTreat(null);
                setPhase("who");
              }}
            >
              Nog een ronde
            </ActionButton>
          ) : phase === "who" ? (
            <ActionButton fullWidth size="lg" disabled={spinning} onClick={spin}>
              {spinning ? "Even geduld…" : "Draai voor wie"}
            </ActionButton>
          ) : null}
        </section>
      </div>
    </main>
  );
}
