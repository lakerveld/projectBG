import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { ParchmentCard } from "./ParchmentCard";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional call to action, typically an <ActionButton />. */
  action?: ReactNode;
  className?: string;
};

/**
 * A quiet, encouraging placeholder for screens with nothing to show yet. Framed
 * as an unwritten page rather than an error — an invitation to act.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <ParchmentCard className={cn("px-6 py-9 text-center", className)}>
      <span
        className="mx-auto mb-4 grid size-16 place-items-center rounded-full border border-dashed border-parchment-edge bg-[#e6d7b4]/50 text-sepia-muted shadow-carved"
        aria-hidden="true"
      >
        <Icon size={28} strokeWidth={1.8} />
      </span>
      <h3 className="font-display text-lg font-bold text-sepia">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-xs font-body text-sm leading-6 text-sepia/80">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </ParchmentCard>
  );
}
