# Game Design

## Purpose

Set the gameplay design direction for the initial Catan-inspired companion experience while avoiding a one-to-one clone of any protected commercial game.

## Design Goals

- Add meaningful table drama through events, bonuses, penalties, and conflict.
- Preserve the physical board as the source of spatial play.
- Support negotiation without forcing rigid app-mediated deals.
- Make mechanics explainable at a glance.
- Allow players to recover from mistakes without derailing the session.

## Core Loop

1. Players take turns around the physical board.
2. The active player enters a dice result or asks the app to roll if that option is enabled.
3. The app applies companion effects tied to the dice result.
4. Players update resources, trades, bonuses, penalties, attacks, and defenses.
5. Each change is recorded in history.
6. Players review kingdom dashboards to understand relative state.

## Companion Mechanics

The app should initially provide lightweight overlays rather than enforce every physical rule. Examples:

- Event outcomes tied to dice rolls.
- Temporary bonuses for underdog players.
- Penalties for overextension or risky actions.
- Attack/defense actions that affect resources or status.
- Trade logging and optional trade suggestions.

The setup flow should stay aligned with the tabletop baseline: a single session supports up to four players, and player identity is assigned from the curated white, orange, blue, and red palette.

## Balance Direction

The MVP should favor transparency over perfect balance. Every event should state:

- Who is affected.
- What changes.
- Why it happened.
- Whether it is optional or mandatory.

## First-Turn Ceremony

After setup, the app randomly crowns one player as the King. The King receives the first-turn marker for round 1, and the dashboard highlights that player's kingdom. This gives the companion app a clear game-master moment before dice, events, or resource automation are introduced.

## Open Questions

- Should events help trailing players to reduce runaway leaders?
- Should attacks cost resources, require dice thresholds, or use cooldowns?
- Should there be a win condition inside the app or only companion state?
- Should the King have any gameplay benefit beyond first turn in the MVP?

## Future Improvements

- Configurable rulesets.
- Difficulty presets.
- Table-tested balance updates.
- Scenario packs.

## Related Documents

- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Kingdom](./Kingdom.md)
