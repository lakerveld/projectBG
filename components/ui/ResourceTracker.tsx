import {
  BrickWall,
  Fence,
  Gem,
  Minus,
  Mountain,
  Plus,
  TreePine,
  Wheat,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/ui/cn";
import type { EntityId, ResourceDefinition } from "@/lib/domain/types";
import { ParchmentCard } from "./ParchmentCard";

export type ResourceLine = {
  definition: ResourceDefinition;
  quantity: number;
};

type ResourceTrackerProps = {
  resources: ResourceLine[];
  title?: string;
  /** Called with the delta (+1 / -1). Omit for a read-only ledger. */
  onAdjust?: (resourceId: EntityId, delta: number) => void;
  className?: string;
};

/** Best-effort iconography for the MVP resource set; falls back to a gem. */
const RESOURCE_ICONS: Record<string, LucideIcon> = {
  wheat: Wheat,
  wood: TreePine,
  brick: BrickWall,
  sheep: Fence,
  ore: Mountain
};

/**
 * The treasury ledger for one realm. Each row is a stepper with a gem marker in
 * the resource colour so identity never rests on colour alone (the label stays).
 */
export function ResourceTracker({ resources, title, onAdjust, className }: ResourceTrackerProps) {
  const readOnly = !onAdjust;
  const total = resources.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <ParchmentCard className={cn("p-4", className)}>
      {title ? (
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-sepia">
            {title}
          </h3>
          <span className="font-body text-xs uppercase tracking-widest text-sepia-muted">
            {total} held
          </span>
        </div>
      ) : null}

      <ul className="grid gap-2.5">
        {resources.map(({ definition, quantity }) => {
          const Icon = RESOURCE_ICONS[definition.id] ?? Gem;

          return (
            <li
              key={definition.id}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-parchment-edge/60 bg-[#e6d7b4]/40 p-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="grid size-9 place-items-center rounded-lg shadow-carved"
                  style={{ backgroundColor: `${definition.color}22`, color: definition.color }}
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-sepia">
                    {definition.name}
                  </p>
                  <p className="font-body text-[0.68rem] uppercase tracking-widest text-sepia-muted">
                    {definition.shortLabel}
                  </p>
                </div>
              </div>

              {readOnly ? (
                <span className="min-w-9 px-2 text-right font-display text-2xl font-bold tabular-nums text-sepia">
                  {quantity}
                </span>
              ) : (
                <div className="grid grid-cols-[2.75rem_2.75rem_2.75rem] items-center gap-1.5">
                  <Stepper
                    label={`Remove ${definition.name}`}
                    disabled={quantity <= 0}
                    onClick={() => onAdjust?.(definition.id, -1)}
                  >
                    <Minus size={18} aria-hidden="true" />
                  </Stepper>
                  <span className="text-center font-display text-2xl font-bold tabular-nums text-sepia">
                    {quantity}
                  </span>
                  <Stepper
                    label={`Add ${definition.name}`}
                    onClick={() => onAdjust?.(definition.id, 1)}
                  >
                    <Plus size={18} aria-hidden="true" />
                  </Stepper>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ParchmentCard>
  );
}

function Stepper({
  children,
  label,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid min-h-11 place-items-center rounded-lg border border-parchment-edge bg-parchment text-sepia shadow-carved transition",
        "hover:bg-[#f3ead2] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        "disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      {children}
    </button>
  );
}
