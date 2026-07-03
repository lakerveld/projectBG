import { Crown } from "lucide-react";
import Image from "next/image";
import { getPlayerAvatar } from "@/lib/domain/avatars";
import { cn } from "@/lib/ui/cn";
import type { Player, ResourceDefinition } from "@/lib/domain/types";
import { ParchmentCard } from "./ParchmentCard";

type PlayerSummaryProps = {
  player: Player;
  /** Optional resource definitions in display order; hidden when bookkeeping is out of scope. */
  resources?: ResourceDefinition[];
  isKing?: boolean;
  /** Highlights the card as the realm whose turn it is. */
  turnActive?: boolean;
  onSelect?: () => void;
  className?: string;
};

/**
 * A realm at a glance: avatar crest, ruler's name, and optional compact resource chips.
 * The selected player colour frames the portrait while the name remains the primary label.
 */
export function PlayerSummary({
  player,
  resources = [],
  isKing,
  turnActive,
  onSelect,
  className
}: PlayerSummaryProps) {
  const initial = player.name.trim().charAt(0).toUpperCase() || "?";
  const avatar = getPlayerAvatar(player.avatarId);

  const body = (
    <div className="flex items-center gap-3.5 p-3.5">
      <span
        className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] bg-[#e6d7b4] font-display text-xl font-bold text-white shadow-carved"
        style={{ borderColor: player.color, backgroundColor: avatar ? undefined : player.color }}
        aria-hidden="true"
      >
        {avatar ? (
          <Image
            src={avatar.src}
            alt=""
            width={56}
            height={56}
            className="size-full object-cover"
            draggable={false}
          />
        ) : (
          initial
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-display text-lg font-bold text-sepia">{player.name}</h3>
          {isKing ? (
            <Crown size={16} className="shrink-0 text-gold" fill="#c8942c" aria-label="King" />
          ) : null}
        </div>
        {resources.length > 0 ? (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {resources.map((resource) => (
              <li
                key={resource.id}
                className="inline-flex items-center gap-1 rounded-full border border-parchment-edge/70 bg-[#e6d7b4]/50 px-2 py-0.5 font-body text-xs text-sepia"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: resource.color }}
                  aria-hidden="true"
                />
                <span className="uppercase tracking-wide text-sepia-muted">
                  {resource.shortLabel}
                </span>
                <span className="font-display font-bold tabular-nums">
                  {player.resources[resource.id] ?? 0}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );

  const highlight = cn(turnActive && "ring-2 ring-gold shadow-glow", className);

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-current={turnActive || undefined}
        className={cn(
          "block w-full rounded-2xl text-left transition active:scale-[0.99]",
          "hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-night"
        )}
      >
        <ParchmentCard className={highlight}>{body}</ParchmentCard>
      </button>
    );
  }

  return <ParchmentCard className={highlight}>{body}</ParchmentCard>;
}
