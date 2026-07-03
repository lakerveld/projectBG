"use client";

import { useRouter } from "next/navigation";
import { UsersRound } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="hall min-h-dvh overflow-x-hidden">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-4 py-12">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold">ProjectBG</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none text-parchment">
            The Table Chronicle
          </h1>
          <p className="mt-3 font-body text-sm leading-6 text-parchment/70">
            A shared-phone game master for physical fantasy board-game nights.
          </p>
        </header>

        <ActionButton icon={UsersRound} fullWidth size="lg" onClick={() => router.push("/setup")}>
          Create game
        </ActionButton>
      </div>
    </main>
  );
}
