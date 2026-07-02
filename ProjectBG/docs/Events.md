# Events

## Purpose

Define the MVP world-event system triggered at the end of each round.

## Core Rule

Events are world events, not player-specific rewards or punishments.

After every player has rolled once, the app calculates the round average. Based on that average, one event is applied to the whole world.

## Goals

- Make events global and table-readable.
- Avoid targeting individual players.
- Use dice results to create shared atmosphere.
- Record event context in history.
- Keep resource, trade, and penalty effects deferred until their systems exist.

## Round Event Flow

1. Every player rolls once during the round.
2. The app stores each dice result.
3. When all players have rolled, the app calculates the average.
4. The app compares the average against the expected Catan-inspired average: 7.
5. The app triggers one world event:
   - Above average: positive world event.
   - Around average: neutral world event.
   - Below average: negative world event.
6. The event affects all players or the shared world state.
7. The event is added to history.

## Average Rules

Expected dice average: 7.

Configurable neutral range: 6-8.

| Round Average | Result |
| ---: | --- |
| 2-5.99 | Negative world event |
| 6-8 | Neutral world event |
| 8.01-12 | Positive world event |

## Example

| Player | Roll |
| --- | ---: |
| Blue | 8 |
| Red | 6 |
| White | 10 |
| Orange | 4 |

Average:

```text
(8 + 6 + 10 + 4) / 4 = 7
```

Result:

```text
Neutral world event
```

## Event Structure

```ts
{
  id: string;
  name: string;
  description: string;
  trigger: "end_of_round";
  category: "positive_world" | "neutral_world" | "negative_world";
  targeting: "global";
  severity: "minor" | "medium" | "major";
  duration: "instant" | "1_round" | "2_rounds";
  effectsApplied: string[];
  mvp: boolean;
}
```

## Positive World Events

Positive events should benefit the table, but not create runaway leads.

Examples:

- Great Harvest: all resource production gives +1 extra resource this round.
- Trade Boom: every player-to-player trade gives both players +1 Gold.
- Golden Roads: road building costs 1 fewer resource this round.
- Prosperous Season: everyone gains +2 Gold.
- Calm Seas: harbor trades are improved for 1 round.

## Neutral World Events

Neutral events should create interaction without strongly helping or hurting.

Examples:

- Market Day: every player may make one 3:1 bank trade.
- Traveling Merchant: one random resource becomes temporarily more valuable.
- Royal Inspection: everyone may convert 1 resource into 1 Gold.
- Festival: players are encouraged to trade; no penalty or bonus.
- Changing Winds: next round's event threshold is slightly adjusted.

## Negative World Events

Negative events affect the shared world, not one player directly.

Examples:

- Drought: wheat produces nothing for 1 round.
- Forest Fire: wood produces nothing for 1 round.
- Market Crash: player-to-player trades give no Gold bonuses this round.
- Bandit Pressure: the next 7 is stronger.
- Heavy Storms: road building costs +1 resource this round.

## Important Rule

Avoid events like:

- Player with most resources loses X.
- Lowest player gains X.
- King loses Gold.
- One player is targeted.

For this version, events should affect:

- The whole board.
- All players equally.
- Resource production rules.
- Trade rules.
- Temporary world modifiers.
- Shared kingdom atmosphere.

## History Entry

Each event history item should include:

```ts
{
  roundNumber: number;
  rolls: number[];
  averageRoll: number;
  eventId: string;
  eventName: string;
  category: string;
  effectsApplied: string[];
  timestamp: string;
}
```

## Open Questions

- Should the neutral range remain 6-8 after playtesting?
- Should the active event last for the next round or only be recorded in history for MVP?
- Which resource names should event examples use once the resource system is finalized?

## Future Improvements

- Configurable event tables.
- Event duration countdown.
- Real resource, trade, and build-cost effects.
- Scenario-specific world event decks.

## Related Documents

- [Dice System](./DiceSystem.md)
- [Mechanics](./Mechanics.md)
- [Game Design](./GameDesign.md)
- [State Management](./StateManagement.md)
- [Sprint 5](./Sprint5.md)
