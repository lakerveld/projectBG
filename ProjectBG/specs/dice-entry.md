# Dice Entry

## Problem

After the King is selected and round 1 begins, the app needs to record the first physical dice result without taking over the physical board game.

## Scope

- Show the current round and first-turn player on the dashboard.
- Let the table enter a dice total from 2 to 12.
- Validate dice totals.
- Record the dice total in game history.
- Persist the updated game locally.
- Mark resource production, momentum, and world events as deferred in metadata.

## User Flow

1. Start the game and crown the King.
2. Open the dashboard.
3. The King rolls physical dice.
4. Tap the rolled total.
5. Tap `Record dice total`.
6. See the dice result in recent history.

## Domain Behavior

- Dice can only be recorded after the game has started.
- Dice total must be a whole number.
- Dice total must be between 2 and 12.
- The current turn player is attached to the history entry.
- The game `updatedAt` timestamp changes after a valid entry.
- Resource, momentum, and world-event handling are explicitly deferred.

## Acceptance Criteria

- Valid totals from 2 to 12 are accepted.
- Invalid totals are rejected by domain validation.
- A valid dice entry creates a `dice.recorded` history entry.
- The dashboard records dice through the store and persistence boundary.
- The UI does not imply resources or events have been resolved.

## Test Notes

- Unit tests cover valid dice recording, low/high invalid totals, and pre-start rejection.
- End-to-end testing should cover setup, start game, King selection, dice entry, and reload.

## Related Docs

- [Sprint 4](../docs/Sprint4.md)
- [Dice System](../docs/DiceSystem.md)
- [Player Flow](../docs/PlayerFlow.md)
- [State Management](../docs/StateManagement.md)

