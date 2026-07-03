import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { KingRandomizer } from "@/components/features/setup/KingRandomizer";

export default function KingPage() {
  return (
    <main className="hall min-h-dvh overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 pb-12 pt-6">
        <Link href="/setup">
          <ActionButton icon={ArrowLeft} variant="ghost" size="sm">
            Back to players
          </ActionButton>
        </Link>
        <header>
          <p className="font-display text-xs uppercase tracking-[0.35em] text-gold/80">
            Step two
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-parchment">
            Crown the King
          </h1>
        </header>
        <KingRandomizer />
      </div>
    </main>
  );
}
