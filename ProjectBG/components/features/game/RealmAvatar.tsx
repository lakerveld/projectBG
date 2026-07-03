"use client";

import { memo } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { getPlayerAvatar } from "@/lib/domain/avatars";
import { cn } from "@/lib/ui/cn";
import type { Player, ResourceDefinition } from "@/lib/domain/types";

type RealmAvatarProps = {
  player: Player;
  resources: ResourceDefinition[];
  turnActive?: boolean;
  positionLabel: string;
  top: string;
  left: string;
};

export const RealmAvatar = memo(function RealmAvatar({
  player,
  resources,
  turnActive,
  positionLabel,
  top,
  left
}: RealmAvatarProps) {
  const avatar = getPlayerAvatar(player.avatarId);
  const initial = player.name.trim().charAt(0).toUpperCase() || "?";
  const totalResources = resources.reduce(
    (sum, resource) => sum + (player.resources[resource.id] ?? 0),
    0
  );

  return (
    <article
      className={cn(
        "group absolute z-10 flex w-[6.2rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-transform duration-300 sm:w-[7.2rem]",
        turnActive && "z-20 scale-[1.16]"
      )}
      aria-label={`${player.name}, ${positionLabel}`}
      style={
        {
          top,
          left,
          "--realm-border": player.color
        } as CSSProperties
      }
    >
      <div className="relative">
        {turnActive ? (
          <span className="realm-aura absolute -inset-2 rounded-full border border-gold/50" />
        ) : null}
        <span
          className={cn(
            "relative grid size-20 place-items-center overflow-hidden rounded-[1.35rem] border-[3px] bg-[#e6d7b4] text-xl font-bold text-white shadow-parchment transition duration-300",
            "max-sm:size-16 max-sm:rounded-[1.1rem]",
            turnActive ? "realm-avatar-active" : "shadow-carved"
          )}
          style={{ borderColor: player.color, backgroundColor: avatar ? undefined : player.color }}
          aria-hidden="true"
        >
          {avatar ? (
            <Image
              src={avatar.src}
              alt=""
              width={80}
              height={80}
              className="size-full object-cover"
              draggable={false}
            />
          ) : (
            initial
          )}
        </span>
        {turnActive ? <span className="realm-current-banner">Current Turn</span> : null}
        {turnActive ? <span className="realm-particles" aria-hidden="true" /> : null}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="max-w-[7rem] rounded-full bg-night/70 px-2 py-0.5 font-display text-sm font-bold text-parchment shadow-seal">
          {player.name}
        </p>
        <div className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-parchment/72">
          <span className="rounded-full border border-gold/20 bg-night/60 px-2 py-0.5 font-bold text-gold">
            VP 0
          </span>
          <span className="rounded-full border border-parchment-edge/20 bg-night/45 px-2 py-0.5">
            {totalResources}
          </span>
        </div>
      </div>
    </article>
  );
});
