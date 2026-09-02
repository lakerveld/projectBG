"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import type { Player, ResourceDefinition, RoundRoll } from "@/lib/domain/types";
import { RealmAvatar } from "./RealmAvatar";

type KingdomMapProps = {
  players: Player[];
  resources: ResourceDefinition[];
  currentTurnPlayerId?: string;
  roundRolls?: RoundRoll[];
};

type Slot = {
  top: string;
  left: string;
  anchor: "top" | "center" | "bottom";
};

const SLOT_MAP: Record<number, Slot[]> = {
  2: [
    { top: "20%", left: "50%", anchor: "top" },
    { top: "78%", left: "50%", anchor: "bottom" }
  ],
  3: [
    { top: "20%", left: "50%", anchor: "top" },
    { top: "75%", left: "34%", anchor: "bottom" },
    { top: "77%", left: "70%", anchor: "bottom" }
  ],
  4: [
    { top: "35%", left: "27%", anchor: "top" },
    { top: "35%", left: "72%", anchor: "top" },
    { top: "61%", left: "26%", anchor: "bottom" },
    { top: "62%", left: "75%", anchor: "bottom" }
  ],
  5: [
    { top: "20%", left: "50%", anchor: "top" },
    { top: "42%", left: "27%", anchor: "center" },
    { top: "42%", left: "72%", anchor: "center" },
    { top: "75%", left: "34%", anchor: "bottom" },
    { top: "77%", left: "70%", anchor: "bottom" }
  ],
  6: [
    { top: "35%", left: "27%", anchor: "top" },
    { top: "20%", left: "50%", anchor: "top" },
    { top: "35%", left: "72%", anchor: "top" },
    { top: "61%", left: "26%", anchor: "bottom" },
    { top: "75%", left: "34%", anchor: "bottom" },
    { top: "77%", left: "70%", anchor: "bottom" }
  ]
};

export const KingdomMap = memo(function KingdomMap({
  players,
  resources,
  currentTurnPlayerId,
  roundRolls = []
}: KingdomMapProps) {
  const slots = useMemo(() => SLOT_MAP[players.length] ?? SLOT_MAP[6], [players.length]);
  const shownPlayers = players.slice(0, slots.length);
  const rollByPlayerId = useMemo(
    () => new Map(roundRolls.map((roll) => [roll.playerId, roll.total] as const)),
    [roundRolls]
  );

  return (
    <section className="relative h-full w-full min-h-0 overflow-hidden bg-[#05131a]">
      <Image
        src="/maps/game-board.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,244,214,0.08),transparent_32%),linear-gradient(180deg,rgba(5,19,26,0.08),rgba(5,19,26,0.42))]" />

      <div className="absolute inset-0 mx-auto h-full w-full max-w-full">
        <div className="kingdom-center-glow" />
        {shownPlayers.map((player, index) => {
          const slot = slots[index];

          if (!slot) {
            return null;
          }

          return (
            <RealmAvatar
              key={player.id}
              player={player}
              resources={resources}
              turnActive={player.id === currentTurnPlayerId}
              diceTotal={rollByPlayerId.get(player.id)}
              positionLabel={slot.anchor}
              top={slot.top}
              left={slot.left}
            />
          );
        })}
      </div>
    </section>
  );
});
