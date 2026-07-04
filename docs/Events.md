# Events

## Purpose

Define the MVP world-event system triggered at the end of each round.

## Core Rule

Events still enter play as shared world events after every player has rolled once.

The round average decides the category:

- Above average: positive event.
- Around average: tactical event.
- Below average: negative event.

Tactical events are the middle category. They replace the older neutral bucket and are allowed to create a temporary table decision, often resolved by the King or the active player.

## Goals

- Make event outcomes readable from one shared phone.
- Keep categories simple: positive, tactical, negative.
- Support short, Catan-compatible rules.
- Allow temporary King choices without blocking the round flow.
- Record event context in history.
- Reveal each triggered event on its own screen before returning to the dashboard.

## Round Event Flow

1. Every player rolls once during the round.
2. The app stores each dice result.
3. When all players have rolled, the app calculates the average.
4. The app compares the average against the expected baseline of `7`.
5. The app selects one event from the matching category.
6. The event is revealed on `/event`.
7. The event is stored as the active world event and added to history.

## Average Rules

Expected dice average: `7`

Configurable tactical range: `6-8`

| Round Average | Result |
| ---: | --- |
| 2-5.99 | Negative event |
| 6-8 | Tactical event |
| 8.01-12 | Positive event |

## Event Categories

```ts
type EventCategory = "positive" | "tactical" | "negative";
```

## Event Structure

```ts
{
  id: string;
  name: string;
  description: string;
  trigger: "end_of_round";
  category: "positive" | "tactical" | "negative";
  targeting: "global";
  severity: "minor" | "medium" | "major";
  duration: "instant" | "1_round" | "2_rounds";
  effectsApplied: string[];
  mvp: boolean;
}
```

## Event Families

### Bush Thief

- `Bush Thief`
- `Bush Thief Captured`
- `Bribe the Bush Thief`
- `Hidden Treasure`
- `Night Raid`
- `Secret Hideout`

These events create robber-style pressure, opportunistic rewards, and short tactical twists around stealing and terrain control.

Newest rules:

- `Bush Thief`: all players roll, lowest roll receives the token, ties reroll, then the King places it on any terrain hex.
- `Bush Thief Captured`: remove the Bush Thief; if a `7` is rolled this round it still moves, but its blocking effect waits until next round.
- `Bribe the Bush Thief`: any player may move it once this round by paying `2 Wood`, `2 Sheep`, and `1 Wheat`.
- `Hidden Treasure`: every player gains `1 random resource`, then remove the Bush Thief.
- `Night Raid`: every player with more than `7 resources` loses `1 random resource`.
- `Secret Hideout`: the King secretly chooses a terrain type; when it produces this round, the Bush Thief steals `1 resource` from one player on that hex.

### King

- `King's Tournament`
- `Royal Decree`
- `Royal Taxation`
- `Shared Wealth`
- `Royal Celebration`
- `Abuse of Power`
- `Royal Favor`

When a King event asks for a choice, the King resolves it for the table unless a card or rule says otherwise.

After every King event, pass the Crown clockwise.

Newest rules:

- `King's Tournament`: all players roll, highest roll wins, ties reroll, winner chooses `2 resources`, `1 free Road`, or `1 Development Card`.
- `Royal Decree`: the King secretly chooses a number from `2-12`, excluding `7`; each time it is rolled this round, the King gains `1 resource of choice`, up to `3`.
- `Royal Taxation`: the King chooses one resource type; until end of round, every build costs `+1` of that resource.
- `Shared Wealth`: for the next `2 rounds`, Roads cost only `1 Brick`.
- `Royal Celebration`: every player gains `1 resource of choice`; the King gains `2 resources of choice`.
- `Abuse of Power`: the King chooses one player; that player discards `2 random resources`.
- `Royal Favor`: the King chooses one player; that player may build `1 free Road`, draw `1 Development Card`, or perform `1 free bank trade`.

### Settlement & City

- `Prosperous Cities`
- `Costly Cities`
- `Master Builders`

These events focus on city upkeep and short-lived construction advantages.

Newest rules:

- `Prosperous Cities`: gain `1 Sheep` from the bank for every City you own, maximum `2`.
- `Costly Cities`: pay `1 Sheep` to the bank for every City you own, maximum `2`.
- `Master Builders`: players with `3 or more Settlements` may reduce one building action by `1 required resource` once this round.

## Current Event Set

### Positive

- `Great Harvest`
- `Golden Roads`
- `Calm Seas`
- `Bush Thief Captured`
- `Hidden Treasure`
- `Shared Wealth`
- `Royal Celebration`
- `Prosperous Cities`

### Tactical

- `Traveling Merchant`
- `Market Day`
- `Bush Thief`
- `Bribe the Bush Thief`
- `Secret Hideout`
- `King's Tournament`
- `Royal Decree`
- `Royal Favor`
- `Master Builders`

### Negative

- `Drought`
- `Forest Fire`
- `Heavy Storms`
- `Night Raid`
- `Royal Taxation`
- `Abuse of Power`
- `Costly Cities`

## Event Reveal Screen

- The event image is used as the full-screen background.
- The reveal panel sits near the bottom of the screen.
- The panel shows the event title, description, and applied rule text.
- The button below the panel returns players to the game dashboard.
- New events may ship with placeholder art while final artwork is pending.

## Placeholder Artwork Policy

- Reuse an existing event image when final artwork is missing.
- Keep the event enabled even when placeholder art is used.
- Add this comment next to each placeholder mapping in code:

```ts
// TODO: Replace with final artwork for this event
```

## Open Questions

- Should the tactical range remain `6-8` after playtesting?
- Which tactical events deserve real rule enforcement first?
- Should King-choice events show a dedicated resolver screen later?

## Future Improvements

- Event deck editing by ruleset.
- Expiration countdown for multi-round effects.
- Real resolution for build-cost and robber-style modifiers.
- Scenario-specific event pools.

## Related Documents

- [Dice System](./DiceSystem.md)
- [Mechanics](./Mechanics.md)
- [Game Design](./GameDesign.md)
- [State Management](./StateManagement.md)
- [Sprint 5](./Sprint5.md)
