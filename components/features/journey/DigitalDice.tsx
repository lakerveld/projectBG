"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

const faces = [[], [5], [1, 9], [1, 5, 9], [1, 3, 7, 9], [1, 3, 5, 7, 9], [1, 3, 4, 6, 7, 9]];

export function DigitalDice({
  dice,
  onClose,
  onConfirm
}: {
  dice: [number, number];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [settled, setSettled] = useState(false);
  const [frame, setFrame] = useState(0);
  const total = dice[0] + dice[1];

  useEffect(() => {
    const opener = document.activeElement;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const interval = reduced
      ? undefined
      : window.setInterval(() => setFrame((value) => value + 1), 110);
    const timer = window.setTimeout(
      () => {
        window.clearInterval(interval);
        setSettled(true);
      },
      reduced ? 0 : 2200
    );
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="digital-dice-title"
      className="dice-portal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={`dice-stage ${settled ? "dice-settled" : "dice-rolling"}`}>
        <div className="dice-vortex" aria-hidden="true" />
        <div className="dice-orbit dice-orbit-one" aria-hidden="true" />
        <div className="dice-orbit dice-orbit-two" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Dobbelscherm sluiten"
          className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full border border-white/30 bg-black/30 text-white"
        >
          <X size={20} />
        </button>
        <div className="relative z-10 flex min-h-[min(720px,90dvh)] flex-col items-center justify-center px-6 py-14 text-center">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d5fa55]">
            <Sparkles size={16} /> Rattan dice club
          </p>
          <h2
            id="digital-dice-title"
            className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl"
          >
            {settled ? "Het lot spreekt" : "Laat het lot rollen"}
          </h2>
          <p className="mt-3 text-sm text-white/70">Twee dobbelstenen. Eén bestemming.</p>
          <div className="dice-pair" aria-hidden="true">
            {dice.map((value, index) => (
              <div key={index} className={`neon-die neon-die-${index}`}>
                {Array.from({ length: 9 }, (_, pip) => (
                  <span
                    key={pip}
                    className={
                      faces[settled ? value : ((frame + index * 3) % 6) + 1].includes(pip + 1)
                        ? "die-pip"
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>
          <div role="status" aria-live="polite" className="min-h-36">
            {settled ? (
              <>
                <p className="dice-total">{total}</p>
                <p className="mt-2 font-bold text-white">
                  Je gooide {dice[0]} + {dice[1]} = {total} ogen.
                </p>
              </>
            ) : (
              <p className="pt-10 text-sm uppercase tracking-[0.25em] text-[#ff91c4]">
                Het universum schudt…
              </p>
            )}
          </div>
          <div className="mt-6 w-full max-w-xs">
            <ActionButton fullWidth size="lg" disabled={!settled} onClick={onConfirm}>
              {settled ? "Bevestig deze worp" : "Dobbelstenen rollen…"}
            </ActionButton>
            <p className="mt-3 text-xs text-white/60">Je voorraad verandert pas na bevestigen.</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
