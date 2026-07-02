import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Panel } from "@/components/ui/Panel";

export default function HistoryPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-5">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted" href="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>
      <AppHeader eyebrow="Game history" title="Action log" />
      <Panel title="History skeleton">
        <p className="text-sm leading-6 text-muted">
          Setup records game creation, King selection, and dice totals first. Later gameplay sprints
          will add resource changes, trades, and corrections.
        </p>
      </Panel>
    </main>
  );
}
