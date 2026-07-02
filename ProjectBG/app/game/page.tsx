"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/ui/AppHeader";
import { ResourceSliceDemo } from "@/components/features/game/ResourceSliceDemo";

export default function GamePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-5">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted" href="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </Link>
      <AppHeader eyebrow="Game dashboard" title="Kingdom state" />
      <ResourceSliceDemo />
    </main>
  );
}

