"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPinned } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

const steps = [
  {
    title: "De legende van Rattan",
    content: (
      <>
        <p>
          Lang geleden leefden diep onder Antwerpen de <strong>Ketanisten van Rattan</strong>,
          geleid door de machtige <strong>Rattenkoning</strong>.
        </p>
        <p>
          Maar het rijk viel uiteen. Handelsroutes verdwenen, de koning raakte vermist en zijn zoon{" "}
          <strong>Baby Ratthew</strong>, de toekomstige erfgenaam, werd ergens in Antwerpen
          verborgen.
        </p>
      </>
    )
  },
  {
    title: "Matthew, die iemand ben jij.",
    content: (
      <>
        <p>Sindsdien wachten de ratten op iemand die Rattan kan herstellen.</p>
        <p>
          Verzamel <strong>Bier, Salmiak, Poedersuiker en Eten</strong>. Herstel de handelsroutes.
          Bouw het rijk opnieuw op en volg de sporen door Antwerpen.
        </p>
        <p>
          En boven alles: <strong>Vind Baby Ratthew.</strong>
        </p>
      </>
    )
  },
  {
    title: "Jouw reis wordt bepaald door de dobbelsteen",
    content: (
      <>
        <p>
          Bij <strong>iedere locatie</strong> begint jouw volgende stap met één worp.
        </p>
        <p>
          De dobbelsteen bepaalt welke <strong>resource</strong> je verdient, welke{" "}
          <strong>opdracht</strong> je te wachten staat en wat er onderweg gebeurt.
        </p>
        <p>
          Soms helpt het lot je vooruit. Soms gooien de <strong>Struikrovers</strong> roet in het
          eten.
        </p>
        <p>
          Elke worp brengt je een stap dichter bij je einddoel:{" "}
          <strong>Herbouw Rattan. Vind Baby Ratthew.</strong>
        </p>
      </>
    )
  }
];

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function goToStep(index: number) {
    setStep(index);
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <main className="hall relative isolate min-h-dvh overflow-x-hidden" lang="nl">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <p className="font-display text-xs uppercase tracking-[0.22em] text-parchment/80">
            Ketanisten van Rattan
          </p>
          <span
            className="shrink-0 font-display text-xs tracking-widest text-gold-bright"
            aria-label={`Stap ${step + 1} van 3`}
          >
            0{step + 1} / 03
          </span>
        </header>

        <div aria-hidden="true" className="flex flex-1 items-center justify-center py-10">
          <div className="trippy-orbit" />
        </div>

        <section aria-labelledby="onboarding-title" className="trippy-story">
          <div className="scroll-in">
            <p className="mb-3 font-display text-xs uppercase tracking-[0.3em] text-gold-bright">
              {["De legende", "Jouw missie", "Het avontuur"][step]}
            </p>
            <h1
              id="onboarding-title"
              ref={heading}
              tabIndex={-1}
              className="font-display text-3xl font-bold leading-tight text-parchment outline-none sm:text-4xl"
            >
              {current.title}
            </h1>
            <div className="mt-5 space-y-4 font-body text-base leading-relaxed text-parchment/80 [&_strong]:font-semibold [&_strong]:text-parchment">
              {current.content}
            </div>
          </div>

          <nav aria-label="Onboarding stappen" className="mt-6 flex items-center gap-2">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Stap ${index + 1}: ${item.title}`}
                aria-current={index === step ? "step" : undefined}
                onClick={() => goToStep(index)}
                className="flex min-h-11 flex-1 items-center rounded focus-visible:outline-2 focus-visible:outline-gold-bright"
              >
                <span
                  className={`h-1 w-full rounded-full transition-colors ${index <= step ? "bg-gold-bright" : "bg-[#f6d9ef]"}`}
                />
              </button>
            ))}
          </nav>
          <div className="mt-2 flex gap-3">
            {step > 0 && (
              <ActionButton
                variant="iron"
                size="lg"
                icon={ArrowLeft}
                aria-label="Vorige stap"
                onClick={() => goToStep(step - 1)}
              />
            )}
            <ActionButton
              className="flex-1"
              size="lg"
              iconRight={isLast ? MapPinned : ArrowRight}
              onClick={() => (isLast ? router.push("/journey") : goToStep(step + 1))}
            >
              {isLast ? "Start het spel" : "Next"}
            </ActionButton>
          </div>
        </section>
      </div>
    </main>
  );
}
