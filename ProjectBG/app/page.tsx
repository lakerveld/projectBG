import Link from "next/link";
import { History, Play, Settings, UsersRound } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-5">
      <AppHeader eyebrow="Sprint 2" title="ProjectBG" />

      <section className="grid gap-3">
        <ButtonLink href="/setup" icon={UsersRound}>
          Create local game
        </ButtonLink>
        <ButtonLink href="/game" icon={Play} variant="secondary">
          Open dashboard
        </ButtonLink>
      </section>

      <Panel title="Current focus">
        <p className="text-sm leading-6 text-muted">
          Current focus is local setup through first turn. Create a table session, add players,
          review the table, start the game, and crown the King.
        </p>
      </Panel>

      <nav className="grid grid-cols-2 gap-3">
        <Link
          className="flex min-h-16 items-center gap-3 rounded-lg border border-line bg-panel px-4 text-sm font-semibold shadow-soft"
          href="/history"
        >
          <History size={20} aria-hidden="true" />
          History
        </Link>
        <Link
          className="flex min-h-16 items-center gap-3 rounded-lg border border-line bg-panel px-4 text-sm font-semibold shadow-soft"
          href="/settings"
        >
          <Settings size={20} aria-hidden="true" />
          Settings
        </Link>
      </nav>
    </main>
  );
}
