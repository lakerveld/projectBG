"use client";

import { cn } from "@/lib/ui/cn";

type DiceTotalPickerProps = {
  totals: number[];
  selectedTotal: number | null;
  onSelect: (total: number) => void;
};

export function DiceTotalPicker({ totals, selectedTotal, onSelect }: DiceTotalPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Aantal ogen">
      {totals.map((total) => (
        <button
          key={total}
          type="button"
          aria-pressed={selectedTotal === total}
          onClick={() => onSelect(total)}
          className={cn(
            "grid min-h-16 place-items-center rounded-xl border font-display text-2xl font-bold shadow-carved transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-gold",
            selectedTotal === total
              ? "border-gold bg-gold text-night-deep"
              : "border-parchment-edge bg-[#e6d7b4]/50 text-sepia hover:bg-[#f1e1bf]"
          )}
        >
          {total}
        </button>
      ))}
    </div>
  );
}
