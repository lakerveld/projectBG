# World Events

## Problem

Dice entry records individual rolls, but the companion app needs a game-master moment at the end of each round. World events use the average of all player rolls to set the shared mood of the table.

## Scope

- Store one dice roll per player per round.
- Detect when all players have rolled.
- Calculate the round average.
- Select a positive, neutral, or negative world event.
- Apply the event globally.
- Record event details in history.

## User Flow

1. The current player enters a dice total.
2. The app records the roll and advances to the next player.
3. The dashboard shows round progress.
4. After the last player rolls, the app calculates the average.
5. The app applies one global world event.
6. The dashboard shows the active world event.
7. The next round begins.

## Domain Behavior

- Average below 6 selects a negative world event.
- Average from 6 through 8 selects a neutral world event.
- Average above 8 selects a positive world event.
- Events target the global world, not a single player.
- Event effects are recorded as descriptions for now.
- Real resource/trade/building effects are deferred.

## Acceptance Criteria

- Current turn advances after a valid roll.
- Round progress updates after a valid roll.
- A round completes when roll count equals player count.
- Completed round creates a `world_event.applied` history entry.
- Active world event is stored on game state.
- Round rolls reset after event application.
- Round number advances after event application.

## Test Notes

- Unit tests cover turn advancement and neutral event at average 7.
- Future tests should cover positive and negative thresholds.

## Related Docs

- [Sprint 5](../docs/Sprint5.md)
- [Events](../docs/Events.md)
- [Dice System](../docs/DiceSystem.md)

