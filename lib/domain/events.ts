import type { RoundRoll, WorldEvent, WorldEventCategory } from "./types";

export const EXPECTED_DICE_AVERAGE = 7;
export const NEUTRAL_AVERAGE_MIN = 6;
export const NEUTRAL_AVERAGE_MAX = 8;

export const WORLD_EVENTS: Record<WorldEventCategory, WorldEvent[]> = {
  positive_world: [
    {
      id: "great-harvest",
      name: "Great Harvest",
      description:
        "The kingdom celebrates an exceptional harvest. The fields are overflowing with wheat.",
      trigger: "end_of_round",
      category: "positive_world",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: ["Every player immediately gains 2 Wheat."],
      effects: [
        { kind: "grant_resource", resourceId: "wheat", quantity: 2, appliesTo: "all_players" }
      ],
      mvp: true
    },
    {
      id: "golden-roads",
      name: "Golden Roads",
      description: "The King's engineers have improved the roads throughout the kingdom.",
      trigger: "end_of_round",
      category: "positive_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: ["Every player may build 1 Road this round for 1 Brick + 0 Wood."],
      effects: [
        {
          kind: "road_discount",
          appliesTo: "all_players",
          metadata: { maxUsesPerPlayer: 1, cost: { brick: 1, wood: 0 } }
        }
      ],
      mvp: true
    },
    {
      id: "calm-seas",
      name: "Calm Seas",
      description: "Perfect sailing weather attracts merchants from distant lands.",
      trigger: "end_of_round",
      category: "positive_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "Harbor trades improve by 1 resource this round: 3:1 becomes 2:1, and 2:1 becomes 1:1."
      ],
      effects: [
        { kind: "harbor_trade_boost", appliesTo: "all_players", metadata: { improvement: 1 } }
      ],
      mvp: true
    }
  ],
  neutral_world: [
    {
      id: "traveling-merchant",
      name: "Traveling Merchant",
      description: "A famous merchant arrives with rare goods.",
      trigger: "end_of_round",
      category: "neutral_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "One random resource is worth 2 resources when trading with the bank this round."
      ],
      effects: [
        {
          kind: "bank_trade_bonus",
          appliesTo: "all_players",
          metadata: { eligibleResources: ["wood", "brick", "sheep", "wheat", "ore"], payout: 2 }
        }
      ],
      mvp: true
    },
    {
      id: "market-day",
      name: "Market Day",
      description: "The kingdom's largest marketplace opens its gates.",
      trigger: "end_of_round",
      category: "neutral_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "Every player may perform one free 3:1 bank trade this round, regardless of harbor ownership."
      ],
      effects: [
        {
          kind: "free_bank_trade",
          appliesTo: "all_players",
          metadata: { ratio: 3, maxUsesPerPlayer: 1 }
        }
      ],
      mvp: true
    },
    {
      id: "kings-tournament",
      name: "King's Tournament",
      description: "The King hosts a grand tournament.",
      trigger: "end_of_round",
      category: "neutral_world",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Every player rolls 1 die; ties reroll until one winner remains.",
        "The winner chooses: gain 2 resources, build 1 free Road, or draw 1 free Development Card."
      ],
      effects: [
        {
          kind: "tournament",
          appliesTo: "winner",
          metadata: {
            dieCount: 1,
            tieRule: "reroll_until_single_winner",
            rewardOptions: ["gain_2_resources", "build_1_free_road", "draw_1_development_card"]
          }
        }
      ],
      mvp: true
    }
  ],
  negative_world: [
    {
      id: "drought",
      name: "Drought",
      description: "An intense drought has ruined the wheat harvest.",
      trigger: "end_of_round",
      category: "negative_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: ["Wheat hexes produce no Wheat until the start of the next round."],
      effects: [{ kind: "production_block", resourceId: "wheat", appliesTo: "global" }],
      mvp: true
    },
    {
      id: "forest-fire",
      name: "Forest Fire",
      description: "A wildfire spreads through the kingdom's forests.",
      trigger: "end_of_round",
      category: "negative_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: ["Forest hexes produce no Wood until the start of the next round."],
      effects: [{ kind: "production_block", resourceId: "wood", appliesTo: "global" }],
      mvp: true
    },
    {
      id: "heavy-storms",
      name: "Heavy Storms",
      description: "Heavy rain and storms make travel nearly impossible.",
      trigger: "end_of_round",
      category: "negative_world",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: ["Every Road built this round costs +1 Sheep: 1 Brick + 1 Wood + 1 Sheep."],
      effects: [
        { kind: "road_surcharge", resourceId: "sheep", quantity: 1, appliesTo: "all_players" }
      ],
      mvp: true
    }
  ]
};

export const MVP_WORLD_EVENTS: Record<WorldEventCategory, WorldEvent> = {
  positive_world: WORLD_EVENTS.positive_world[0],
  neutral_world: WORLD_EVENTS.neutral_world[1],
  negative_world: WORLD_EVENTS.negative_world[2]
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

export function selectWorldEventForAverage(
  average: number,
  random: () => number = Math.random
): WorldEvent {
  const events = WORLD_EVENTS[categorizeRoundAverage(average)];
  const eventIndex = Math.min(Math.floor(random() * events.length), events.length - 1);
  return prepareWorldEvent(events[eventIndex] ?? events[0], random);
}

function prepareWorldEvent(event: WorldEvent, random: () => number): WorldEvent {
  if (event.id !== "traveling-merchant") {
    return event;
  }

  const resources = ["wood", "brick", "sheep", "wheat", "ore"];
  const resourceIndex = Math.min(Math.floor(random() * resources.length), resources.length - 1);
  const resourceId = resources[resourceIndex] ?? "wood";
  const resourceName = resourceId.charAt(0).toUpperCase() + resourceId.slice(1);

  return {
    ...event,
    effectsApplied: [`${resourceName} is worth 2 resources when trading with the bank this round.`],
    effects: event.effects.map((effect) =>
      effect.kind === "bank_trade_bonus"
        ? {
            ...effect,
            resourceId,
            metadata: {
              ...effect.metadata,
              selectedResource: resourceId
            }
          }
        : effect
    )
  };
}
