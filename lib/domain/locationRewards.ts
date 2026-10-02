import type { LocationView } from "./locationGame";
import { emptyInventory, type JourneyInventory, type RewardResource } from "./journeyRewards";

export type RewardEffect = { cost: JourneyInventory; gain: JourneyInventory };
const resourceNames: Record<string, RewardResource> = {
  gerst: "Gerst",
  pils: "Gerst",
  bier: "Gerst",
  salmari: "Salmari",
  salmiak: "Salmari",
  sneeuw: "Sneeuw"
};

// Only execute fully understood resource instructions; never guess from prose.
function amounts(text: string): JourneyInventory | null {
  const result = { ...emptyInventory };
  const tokens = text
    .trim()
    .split(/\s*(?:,|\+|\ben\b)\s*/i)
    .filter(Boolean);
  if (!tokens.length) return null;
  for (const token of tokens) {
    const match = token.trim().match(/^(\d+)\s+(gerst|pils|bier|salmari|salmiak|sneeuw)$/i);
    if (!match) return null;
    const count = Number(match[1]);
    const resource = resourceNames[match[2].toLowerCase()];
    if (!Number.isSafeInteger(count) || count <= 0) return null;
    result[resource] += count;
    if (!Number.isSafeInteger(result[resource])) return null;
  }
  return result;
}

export function parseRewardEffect(bonus: string): RewardEffect | null {
  const text = bonus.trim().replace(/\.$/, "");
  const exchange = text.match(/^(?:ruil\s+)?(.+?)\s*(?:\bvoor\b|=)\s*(.+)$/i);
  if (exchange) {
    const cost = amounts(exchange[1]);
    const gain = amounts(exchange[2]);
    return cost && gain ? { cost, gain } : null;
  }
  const gain = amounts(text);
  return gain ? { cost: { ...emptyInventory }, gain } : null;
}

export function isExchange(effect: RewardEffect) {
  return Object.values(effect.cost).some((amount) => amount > 0);
}

export function rewardKey(location: LocationView) {
  return `location:${location.id}:${location.result?.rewardId ?? location.unlockedAt ?? "legacy"}:${location.result?.bonus ?? ""}`;
}
