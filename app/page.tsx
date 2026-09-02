"use client";

import { useRouter } from "next/navigation";
import { MapPinned } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="hall min-h-dvh overflow-x-hidden">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-4 py-12">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">
            Antwerp Journey
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none text-parchment">
            Ketanisten van Rattan
          </h1>
          <p className="mt-3 font-body text-sm leading-6 text-parchment/70">
            A route companion for Matthew&apos;s Antwerp walk, with GPS-aware stops and physical
            dice moments.
          </p>
        </header>

        <ActionButton icon={MapPinned} fullWidth size="lg" onClick={() => router.push("/journey")}>
          Open map shell
        </ActionButton>
      </div>
    </main>
  );
}
