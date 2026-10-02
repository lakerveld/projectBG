"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { isExchange, parseRewardEffect } from "@/lib/domain/locationRewards";
import { rewardResources } from "@/lib/domain/journeyRewards";
import { applyReward, useRewardInventory } from "@/lib/ui/useRewardInventory";

export function RewardAction({ rewardId, bonus }: { rewardId: string; bonus: string }) {
  const { inventory, used } = useRewardInventory();
  const [error, setError] = useState("");
  const effect = parseRewardEffect(bonus);
  if (!effect)
    return <p className="text-sm">Deze beloning wordt in het fysieke spel uitgevoerd.</p>;
  const exchange = isExchange(effect);
  if (used.includes(rewardId))
    return (
      <p role="status" className="text-sm font-bold">
        {exchange ? "Ruil uitgevoerd · kaart gebruikt" : "Beloning bijgeschreven in je voorraad"}
      </p>
    );
  const missing = rewardResources.filter((resource) => inventory[resource] < effect.cost[resource]);
  return (
    <div className="space-y-3">
      {exchange && (
        <p className="text-sm">
          Eenmalige ruil. Je voorraad:{" "}
          {rewardResources.map((name) => `${inventory[name]} ${name}`).join(" · ")}.
        </p>
      )}
      {missing.length > 0 && (
        <p className="text-sm">
          Nog nodig:{" "}
          {missing.map((name) => `${effect.cost[name] - inventory[name]} ${name}`).join(" · ")}.
        </p>
      )}
      <ActionButton
        fullWidth
        disabled={missing.length > 0}
        onClick={() => {
          try {
            applyReward(rewardId, effect);
            setError("");
          } catch (error) {
            setError(error instanceof Error ? error.message : "Opslaan mislukt. Probeer opnieuw.");
          }
        }}
      >
        {exchange ? "Voer ruil uit" : "Schrijf beloning bij"}
      </ActionButton>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
