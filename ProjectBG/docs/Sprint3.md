# Sprint 3

## Purpose

Implement the review, start game, and random King selection flow after players are added.

## Goals

- Let players review the table before starting.
- Start the local game from the setup screen.
- Randomly select one player as the King.
- Mark the King as the first-turn player.
- Persist the started game locally.

## Scope

- Add domain command for `startGame`.
- Randomly select a King from the saved players.
- Store `kingPlayerId`, `currentTurnPlayerId`, `round`, and `setupStatus`.
- Record a `game.started` history entry.
- Add a short King selection animation.
- Route to the game dashboard after starting.
- Highlight the King in the dashboard.
- Add unit tests for King selection and already-started validation.

## Out of Scope

- Dice entry.
- Resource production from dice.
- Momentum.
- World events.
- Turn rotation after the first turn.
- Trading.
- Attack/defense.

## Definition of Done

- A saved setup can be reviewed.
- Pressing Start Game triggers a short King selection animation.
- Exactly one player is selected as King.
- The King receives the first-turn marker.
- The game is persisted as in progress.
- The dashboard highlights the King.
- Unit tests cover the start-game command.

## Open Questions

- Should the King selection animation be skippable?
- Should the selected King be announced with sound later in a native wrapper?
- Should players be able to restart King selection before round 1 begins?

## Future Improvements

- Richer crown animation.
- Player order and clockwise turn tracking.
- Optional house rule for manual first-player selection.
- Haptic feedback in native wrapper.

## Related Documents

- [Sprint 2](./Sprint2.md)
- [Sprint 4](./Sprint4.md)
- [Player Flow](./PlayerFlow.md)
- [Kingdom](./Kingdom.md)
- [UX](./UX.md)
