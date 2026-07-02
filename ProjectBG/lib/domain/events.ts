import type { RoundRoll, WorldEvent, WorldEventCategory } from "./types";

export const EXPECTED_DICE_AVERAGE = 7;
export const NEUTRAL_AVERAGE_MIN = 6;
export const NEUTRAL_AVERAGE_MAX = 8;

export const MVP_WORLD_EVENTS: Record<WorldEventCategory, WorldEvent> = {
  positive_world: {
    id: "great-harvest",
    name: "Great Harvest",
    description: "The world is generous. Resource production bonuses will be considered next.",
    trigger: "end_of_round",
    category: "positive_world",
    targeting: "global",
    severity: "minor",
    duration: "1_round",
    effectsApplied: ["Positive world mood recorded. Resource effects deferred."],
    mvp: true
  },
  neutral_world: {
    id: "market-day",
    name: "Market Day",
    description: "The world is steady. Trade and conversion rules will be considered next.",
    trigger: "end_of_round",
    category: "neutral_world",
    targeting: "global",
    severity: "minor",
    duration: "instant",
    effectsApplied: ["Neutral world mood recorded. Trade effects deferred."],
    mvp: true
  },
  negative_world: {
    id: "heavy-storms",
    name: "Heavy Storms",
    description: "The world turns harsh. Shared penalties will be considered next.",
    trigger: "end_of_round",
    category: "negative_world",
    targeting: "global",
    severity: "minor",
    duration: "1_round",
    effectsApplied: ["Negative world mood recorded. Penalty effects deferred."],
    mvp: true
  }
};

export function calculateRoundAverage(rolls: RoundRoll[]) {
  if (rolls.length === 0) {
    return 0;
  }

  const total = rolls.reduce((sum, roll) => sum + roll.total, 0);
  return total / rolls.length;
}

export function categorizeRoundAverage(average: number): WorldEventCategory {
  if (average < NEUTRAL_AVERAGE_MIN) {
    return "negative_world";
  }

  if (average <= NEUTRAL_AVERAGE_MAX) {
    return "neutral_world";
  }

  return "positive_world";
}

export function selectWorldEventForAverage(average: number): WorldEvent {
  return MVP_WORLD_EVENTS[categorizeRoundAverage(average)];
}

