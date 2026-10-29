"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPinned } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

const steps = [
  {
    title: "Kolonisten van Rattan",
    content: (
      <>
        <p>
          Lang geleden leefden diep onder Antwerpen de <strong>Kolonisten van Rattan</strong>,
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
    title: "Jouw missie",
    hideTitle: true,
    content: (
      <>
        <p>Sindsdien wachten de ratten op iemand die Rattan kan herstellen.</p>
        <p>Matthew, die iemand ben jij.</p>
        <p>
          Verzamel <strong>Gerst, Salmari en Water</strong>. Herstel de handelsroutes. Bouw het rijk
          opnieuw op en volg de sporen door Antwerpen.
        </p>
        <p>
          En boven alles: <strong>Vind Baby Ratthew.</strong>
        </p>
      </>
    )
  },
  {
    title: "Dobbel. Draai. Durf.",
    content: (
      <>
        <p>
          <strong>Dobbel zo vaak je wilt.</strong> Je worp bepaalt welke resource je verdient. Maar
          pas op: de <strong>struikrover</strong> ligt op de loer.
        </p>
        <p>
          <strong>Draai aan het rattenrad</strong> en laat het lot bepalen wie trakteert — en
          waarop.
        </p>
        <p>
          Voltooi de opdrachten op <strong>alle zes locaties</strong> en verdien{" "}
          <strong>ontwikkelingskaarten</strong>.
        </p>
        <p>
          Maar pas op… <strong>fout antwoord? Dan betaal je.</strong> Het rattenrad bepaalt jouw
          traktatie.
        </p>
      </>
    )
  }
];

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [artworkReady, setArtworkReady] = useState(false);
  const artwork = useRef<HTMLImageElement>(null);
  const introArtwork = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  useEffect(() => {
    if (introDone) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const finish = () => setIntroDone(true);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const timer = window.setTimeout(() => {
      if (motion.matches) return finish();
      if (!artworkReady || !artwork.current || !introArtwork.current) return;
      const rect = artwork.current.getBoundingClientRect();
      if (!introArtwork.current.animate) return finish();
      animation = introArtwork.current.animate(
        [
          {
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            borderWidth: "0px"
          },
          {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            borderRadius: "50%",
            borderWidth: "2px"
          }
        ],
        { duration: 1000, delay: 1100, easing: "cubic-bezier(0.65, 0, 0.2, 1)", fill: "both" }
      );
      animation.onfinish = finish;
    }, 0);
    // A viewport change invalidates the measured destination: reveal the responsive layout.
    window.addEventListener("resize", finish);
    motion.addEventListener("change", finish);
    return () => {
      window.clearTimeout(timer);
      animation?.cancel();
      window.removeEventListener("resize", finish);
      motion.removeEventListener("change", finish);
      document.body.style.overflow = previousOverflow;
    };
  }, [artworkReady, introDone]);

  useEffect(() => {
    if (!introDone) return;
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, introDone]);

  function goToStep(index: number) {
    setStep(index);
  }

  return (
    <main
      className={`hall onboarding relative isolate min-h-dvh overflow-x-hidden ${introDone ? "onboarding-ready" : "onboarding-intro"}`}
      lang="nl"
    >
      {!introDone && (
        <div className="fixed inset-0 z-50" aria-hidden="true">
          <div ref={introArtwork} className="absolute inset-0 overflow-hidden border-ink bg-night">
            <Image
              src="/onboarding/matthew-trippy.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_22%]"
              onLoad={() => setArtworkReady(true)}
              onError={() => setIntroDone(true)}
            />
          </div>
        </div>
      )}
      <div className="onboarding-layout mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 sm:px-8">
        <header
          className="onboarding-copy flex items-center justify-between gap-4"
          inert={!introDone}
        >
          <p className="font-display text-xs uppercase tracking-[0.22em] text-parchment/80">
            Kolonisten van Rattan
          </p>
          <span
            className="shrink-0 font-display text-xs tracking-widest text-gold-bright"
            aria-label={`Stap ${step + 1} van 3`}
          >
            0{step + 1} / 03
          </span>
        </header>

        <div className="onboarding-portrait flex shrink-0 items-center justify-center">
          <Image
            ref={artwork}
            src="/onboarding/matthew-trippy.png"
            alt="Psychedelische illustratie van Matthew met een rat op zijn schouder, een Salmari-fles en het bord ‘Matthew is cooked tonight!’"
            width={1086}
            height={1448}
            priority
            sizes="(max-height: 700px) 72px, 112px"
            className={`onboarding-avatar block rounded-full border-2 border-ink object-cover shadow-parchment ${introDone ? "" : "invisible"}`}
          />
        </div>

        <section
          aria-labelledby="onboarding-title"
          className="onboarding-copy onboarding-story trippy-story flex flex-1 flex-col"
          inert={!introDone}
        >
          <div className="scroll-in">
            <p className="onboarding-eyebrow mb-2 font-display text-xs uppercase tracking-[0.3em] text-gold-bright">
              {["De legende", "Jouw missie", "Het avontuur"][step]}
            </p>
            <h1
              id="onboarding-title"
              ref={heading}
              tabIndex={-1}
              className={
                current.hideTitle
                  ? "sr-only"
                  : "onboarding-heading font-display text-2xl font-bold leading-tight text-parchment outline-none sm:text-3xl"
              }
            >
              {current.title}
            </h1>
            <div
              className={`onboarding-body ${current.hideTitle ? "" : "mt-3"} space-y-3 font-body text-base leading-relaxed text-parchment/80 [&_strong]:font-semibold [&_strong]:text-parchment`}
            >
              {current.content}
            </div>
          </div>

          <nav aria-label="Onboarding stappen" className="mt-auto flex items-center gap-2 pt-2">
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
