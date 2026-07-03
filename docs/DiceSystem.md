# Dice System

## Purpose

Define how dice rolls are entered, represented, resolved, and connected to random event generation.

## Goals

- Support manual dice entry for physical dice.
- Optionally support app-generated rolls later.
- Make dice outcomes auditable in game history.
- Keep event generation deterministic enough for testing.

## MVP Design

The MVP should store each dice action as a history entry with:

- Roll value.
- Entered by or active player, if known.
- Timestamp.
- Triggered event IDs.
- Applied effects.

Manual entry is the default because the app enhances physical play and players may already roll dice at the table.

Sprint 4 uses total-only entry. Players roll physical dice and enter a total from 2 to 12. Individual die values, resource production, and momentum are deferred until the dice loop is stable.

## Event Triggering

Sprint 5 triggers world events from the round average after every player has rolled once.

The event generator should accept:

- Current game state.
- Current round rolls.
- Active ruleset.
- Random seed or random provider.

Returning structured event effects makes the system testable and replayable.

## Validation

- Two six-sided dice imply valid totals from 2 to 12.
- Invalid entries should be blocked with clear UI feedback.
- Repeated accidental entries should be reversible through history correction.
- Dice entry is only available after the game has started.

## Open Questions

- Should special totals always trigger events or only roll against a probability table?
- Should a roll of 7 have a special companion behavior?
- Should players be able to annotate a roll?
- Should future versions capture both individual die values instead of only the total?

## Future Improvements

- Animated dice roller.
- Seeded random sessions.
- Probability display.
- House-rule dice profiles.

## Related Documents

- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
- [Game Design](./GameDesign.md)
- [State Management](./StateManagement.md)
