import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Panel } from "@/components/ui/Panel";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-5">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted" href="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>
      <AppHeader eyebrow="Rules and storage" title="Session settings" />
      <Panel title="MVP settings skeleton">
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Storage</dt>
            <dd className="font-semibold">Local IndexedDB</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Accounts</dt>
            <dd className="font-semibold">None</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Ruleset</dt>
            <dd className="font-semibold">Original MVP preset</dd>
          </div>
        </dl>
      </Panel>
    </main>
  );
}

