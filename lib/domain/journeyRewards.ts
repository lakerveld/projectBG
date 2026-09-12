export const rewardResources = ["Bier", "Salmiak", "Poedersuiker", "Eten"] as const;
export type RewardResource = (typeof rewardResources)[number];
export type JourneyInventory = Record<RewardResource, number>;
export const emptyInventory: JourneyInventory = { Bier: 0, Salmiak: 0, Poedersuiker: 0, Eten: 0 };

// Temporary reward table approved for the journey prototype.
export function resourceForRoll(total: number): RewardResource | null {
  if (!Number.isInteger(total) || total < 2 || total > 12) throw new Error("Ongeldige worp");
  if (total === 7) return null;
  if (total <= 4) return "Bier";
  if (total <= 6) return "Salmiak";
  if (total <= 9) return "Poedersuiker";
  return "Eten";
}

export function readInventory(): JourneyInventory {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem("rattan-journey-inventory") ?? "null");
    if (typeof saved !== "object" || saved === null) return { ...emptyInventory };
    const result = { ...emptyInventory };
    for (const name of rewardResources) {
      const value = (saved as Record<string, unknown>)[name];
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
