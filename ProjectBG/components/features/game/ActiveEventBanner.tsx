"use client";

import { memo } from "react";
import type { WorldEvent } from "@/lib/domain/types";

type ActiveEventBannerProps = {
  event?: WorldEvent;
};

export const ActiveEventBanner = memo(function ActiveEventBanner({
  event
}: ActiveEventBannerProps) {
  if (!event) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-night/60 px-3 py-1 text-parchment shadow-carved">
      <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_14px_rgba(200,148,44,0.9)]" />
      <span className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold">
        {event.name}
      </span>
    </div>
  );
});
