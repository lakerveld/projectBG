import type { RoundRoll, WorldEvent, WorldEventCategory } from "./types";

export const EXPECTED_DICE_AVERAGE = 7;
export const TACTICAL_AVERAGE_MIN = 6;
export const TACTICAL_AVERAGE_MAX = 8;

export const WORLD_EVENTS: Record<WorldEventCategory, WorldEvent[]> = {
  positive: [
    {
      id: "great-harvest",
      name: "Great Harvest",
      description: "The fields overflow, and every granary is filled to the brim.",
      trigger: "end_of_round",
      category: "positive",
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
      description: "Royal engineers smooth the roads and speed up travel.",
      trigger: "end_of_round",
      category: "positive",
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
      description: "Safe waters bring easy trade to every harbor.",
      trigger: "end_of_round",
      category: "positive",
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
    },
    {
      id: "bush-thief-captured",
      name: "Bush Thief Captured",
      description: "The royal guards have finally captured the Bush Thief.",
      trigger: "end_of_round",
      category: "positive",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "Remove the Bush Thief from the board.",
        "If a 7 is rolled this round, move the Bush Thief as normal.",
        "Its blocking effect does not activate until the beginning of the next round."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "global",
          metadata: {
            removeBushThief: true,
            trigger: "next_7_this_round",
            result: "move_normally_but_delay_blocking_until_next_round"
          }
        }
      ],
      mvp: true
    },
    {
      id: "hidden-treasure",
      name: "Hidden Treasure",
      description: "While chasing the Bush Thief, hidden treasure is discovered.",
      trigger: "end_of_round",
      category: "positive",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: ["Every player gains 1 random resource.", "Remove the Bush Thief from the board."],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { reward: "1_random_resource_each", removeBushThief: true }
        }
      ],
      mvp: true
    },
    {
      id: "shared-wealth",
      name: "Shared Wealth",
      description: "The King invests in the kingdom's infrastructure.",
      trigger: "end_of_round",
      category: "positive",
      targeting: "global",
      severity: "minor",
      duration: "2_rounds",
      effectsApplied: [
        "For the next 2 rounds, Roads cost only 1 Brick instead of 1 Brick + 1 Wood.",
        "Pass the Crown clockwise."
      ],
      effects: [
        {
          kind: "road_discount",
          appliesTo: "all_players",
          metadata: { cost: { brick: 1, wood: 0 }, rounds: 2, passCrownClockwise: true }
        }
      ],
      mvp: true
    },
    {
      id: "royal-celebration",
      name: "Royal Celebration",
      description: "The King hosts a kingdom-wide feast.",
      trigger: "end_of_round",
      category: "positive",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Every player gains 1 resource of choice.",
        "The King gains 2 resources of choice.",
        "Pass the Crown clockwise."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            reward: "1_resource_of_choice_each",
            kingBonus: "2_resources_of_choice",
            passCrownClockwise: true
          }
        }
      ],
      mvp: true
    },
    {
      id: "prosperous-cities",
      name: "Prosperous Cities",
      description: "Bustling cities fill the kingdom's treasury.",
      trigger: "end_of_round",
      category: "positive",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: ["For every City you own, gain 1 Sheep from the bank.", "Maximum: 2 Sheep."],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { perCityReward: { sheep: 1 }, maxReward: { sheep: 2 } }
        }
      ],
      mvp: true
    }
  ],
  tactical: [
    {
      id: "traveling-merchant",
      name: "Traveling Merchant",
      description: "A famous merchant arrives with rare goods and sharp prices.",
      trigger: "end_of_round",
      category: "tactical",
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
      description: "The biggest market in the realm opens for fast deals.",
      trigger: "end_of_round",
      category: "tactical",
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
      id: "bush-thief",
      name: "Bush Thief",
      description: "A cunning bush thief is terrorizing the countryside.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Every player rolls 1 die. Lowest roll receives the Bush Thief token; ties reroll.",
        "The King chooses any terrain hex.",
        "Place the Bush Thief on that hex.",
        "The Bush Thief functions exactly like the Robber."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "global",
          metadata: {
            rollAllPlayers: 1,
            lowestRollGetsToken: true,
            ties: "reroll",
            hexChooser: "king",
            behavesLike: "robber"
          }
        }
      ],
      mvp: true
    },
    {
      id: "bribe-the-bush-thief",
      name: "Bribe the Bush Thief",
      description: "Gold is not the only thing a thief values.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "Any player may move the Bush Thief once this round by paying 2 Wood, 2 Sheep, and 1 Wheat.",
        "The Bush Thief may be moved to any legal hex."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            maxUsesPerPlayer: 1,
            cost: { wood: 2, sheep: 2, wheat: 1 },
            reward: "move_bush_thief_to_any_legal_hex"
          }
        }
      ],
      mvp: true
    },
    {
      id: "secret-hideout",
      name: "Secret Hideout",
      description: "The Bush Thief escapes into the wilderness.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "The King secretly chooses a terrain type.",
        "Whenever that terrain produces this round, the Bush Thief steals 1 resource from one player on that hex."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            chooser: "king",
            secretChoice: "terrain_type",
            trigger: "chosen_terrain_produces_this_round",
            result: "steal_1_resource_from_1_player_on_that_hex"
          }
        }
      ],
      mvp: true
    },
    {
      id: "kings-tournament",
      name: "King's Tournament",
      description: "The King calls for one bold contest before play continues.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Every player rolls 1 die; ties reroll until one winner remains.",
        "The winner chooses: gain 2 resources, build 1 free Road, or draw 1 Development Card.",
        "Pass the Crown clockwise."
      ],
      effects: [
        {
          kind: "tournament",
          appliesTo: "winner",
          metadata: {
            dieCount: 1,
            tieRule: "reroll_until_single_winner",
            rewardOptions: ["gain_2_resources", "build_1_free_road", "draw_1_development_card"],
            passCrownClockwise: true
          }
        }
      ],
      mvp: true
    },
    {
      id: "royal-decree",
      name: "Royal Decree",
      description: "The King declares a lucky number.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "The King secretly chooses a number between 2 and 12, excluding 7.",
        "Whenever that number is rolled this round, the King gains 1 resource of choice.",
        "Maximum reward: 3 resources.",
        "The event ends after the King has gained 3 resources or after one full round."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            chooser: "king",
            secretChoice: "number_2_to_12_excluding_7",
            reward: "1_resource_of_choice_to_king",
            maxRewards: 3,
            endsAfter: "1_full_round"
          }
        }
      ],
      mvp: true
    },
    {
      id: "royal-favor",
      name: "Royal Favor",
      description: "The King grants a special privilege.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Choose one player.",
        "That player may immediately build 1 Road for free, draw 1 Development Card, or perform one free bank trade.",
        "Pass the Crown clockwise."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            chooser: "king",
            selectOnePlayer: true,
            rewardOptions: ["build_1_free_road", "draw_1_development_card", "free_bank_trade"],
            passCrownClockwise: true
          }
        }
      ],
      mvp: true
    },
    {
      id: "master-builders",
      name: "Master Builders",
      description: "Experienced builders share their knowledge.",
      trigger: "end_of_round",
      category: "tactical",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "Every player with 3 or more Settlements may reduce the cost of one building action by 1 required resource.",
        "Applies once this round."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: {
            requirement: "3_or_more_settlements",
            maxUsesPerPlayer: 1,
            modifier: "-1_required_resource_to_one_building_action"
          }
        }
      ],
      mvp: true
    }
  ],
  negative: [
    {
      id: "drought",
      name: "Drought",
      description: "Dry winds scorch the wheat fields across the realm.",
      trigger: "end_of_round",
      category: "negative",
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
      description: "Fire races through the woods and halts timber production.",
      trigger: "end_of_round",
      category: "negative",
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
      description: "Road crews struggle as rain and mud swallow the paths.",
      trigger: "end_of_round",
      category: "negative",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: ["Every Road built this round costs +1 Sheep: 1 Brick + 1 Wood + 1 Sheep."],
      effects: [
        { kind: "road_surcharge", resourceId: "sheep", quantity: 1, appliesTo: "all_players" }
      ],
      mvp: true
    },
    {
      id: "night-raid",
      name: "Night Raid",
      description: "The Bush Thief strikes under cover of darkness.",
      trigger: "end_of_round",
      category: "negative",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "Every player with more than 7 resources loses 1 random resource.",
        "The Bush Thief remains on the board."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { requirement: "more_than_7_resources", lose: "1_random_resource", bushThiefRemains: true }
        }
      ],
      mvp: true
    },
    {
      id: "royal-taxation",
      name: "Royal Taxation",
      description: "The crown demands a fresh levy from every realm.",
      trigger: "end_of_round",
      category: "negative",
      targeting: "global",
      severity: "minor",
      duration: "1_round",
      effectsApplied: [
        "The King chooses one resource type.",
        "Until the end of this round, every player must pay 1 extra of that resource whenever they build."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { chooser: "king", selectedResourceSurcharge: 1, appliesWhen: "building_until_end_of_round" }
        }
      ],
      mvp: true
    },
    {
      id: "abuse-of-power",
      name: "Abuse of Power",
      description: "Power has gone to the King's head.",
      trigger: "end_of_round",
      category: "negative",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: [
        "The King chooses one player.",
        "That player immediately discards 2 random resources.",
        "Pass the Crown clockwise."
      ],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { chooser: "king", selectOnePlayer: true, discard: "2_random_resources", passCrownClockwise: true }
        }
      ],
      mvp: true
    },
    {
      id: "costly-cities",
      name: "Costly Cities",
      description: "Large cities are expensive to maintain.",
      trigger: "end_of_round",
      category: "negative",
      targeting: "global",
      severity: "minor",
      duration: "instant",
      effectsApplied: ["For every City you own, pay 1 Sheep to the bank.", "Maximum: 2 Sheep."],
      effects: [
        {
          kind: "custom_rule",
          appliesTo: "all_players",
          metadata: { perCityCost: { sheep: 1 }, maxCost: { sheep: 2 } }
        }
      ],
      mvp: true
    }
  ]
};

export const MVP_WORLD_EVENTS: Record<WorldEventCategory, WorldEvent> = {
  positive: WORLD_EVENTS.positive[0],
  tactical: WORLD_EVENTS.tactical[1],
  negative: WORLD_EVENTS.negative[2]
};

export function calculateRoundAverage(rolls: RoundRoll[]) {
  if (rolls.length === 0) {
    return 0;
  }

  const total = rolls.reduce((sum, roll) => sum + roll.total, 0);
  return total / rolls.length;
}

export function categorizeRoundAverage(average: number): WorldEventCategory {
  if (average < TACTICAL_AVERAGE_MIN) {
    return "negative";
  }

  if (average <= TACTICAL_AVERAGE_MAX) {
    return "tactical";
  }

  return "positive";
}

export function selectWorldEventForAverage(
  average: number,
  random: () => number = Math.random
): WorldEvent {
  void average;
  return selectRandomWorldEvent(random);
}

export function selectRandomWorldEvent(random: () => number = Math.random): WorldEvent {
  const events = Object.values(WORLD_EVENTS).flat();
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
