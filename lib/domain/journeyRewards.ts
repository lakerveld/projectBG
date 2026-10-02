export const rewardResources = ["Gerst", "Salmari", "Sneeuw"] as const;
export const resourceExchangeLabels = {
  Gerst: "3 gerst = 1 biertje",
  Salmari: "1 Salmari = 1 shotje",
  Sneeuw: "2 sneeuw = 1 nakje"
} as const;

export type RewardResource = (typeof rewardResources)[number];
export type JourneyInventory = Record<RewardResource, number>;
export const emptyInventory: JourneyInventory = { Gerst: 0, Salmari: 0, Sneeuw: 0 };

// Two-dice resource table; seven activates the robber without a reward.
export function resourceForRoll(total: number): RewardResource | null {
  if (!Number.isInteger(total) || total < 2 || total > 12) throw new Error("Ongeldige worp");
  if (total === 7) return null;
  if ([2, 4, 12].includes(total)) return "Salmari";
  if ([3, 5, 10, 11].includes(total)) return "Sneeuw";
  return "Gerst";
}

export function readInventory(): JourneyInventory {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem("rattan-journey-inventory") ?? "null");
    if (typeof saved !== "object" || saved === null) return { ...emptyInventory };
    const result = { ...emptyInventory };
    for (const name of rewardResources) {
      const stored = saved as Record<string, unknown>;
      const legacyName = name === "Gerst" ? "Bier" : name === "Sneeuw" ? "Poedersuiker" : name;
      const previousName = name === "Gerst" ? "Pils" : name === "Salmari" ? "Salmiak" : "Sneeuwvlokje";
      const value = stored[name] ?? stored[previousName] ?? stored[legacyName];
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0)
        result[name] = value;
    }
    return result;
  } catch {
    return { ...emptyInventory };
  }
}

/** Each available resource type has an equal chance; empty stocks cannot be stolen. */
export function stealRandomResource(inventory: JourneyInventory, random = Math.random) {
  const available = rewardResources.filter((name) => inventory[name] > 0);
  const resource = available.length ? available[Math.floor(random() * available.length)] : null;
  return {
    resource,
    inventory: resource ? { ...inventory, [resource]: inventory[resource] - 1 } : { ...inventory }
  };
}
