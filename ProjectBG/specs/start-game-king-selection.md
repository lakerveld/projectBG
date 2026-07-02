# Start Game and King Selection

## Problem

After players are added, the table needs a clear start moment. The companion app should review the saved players, randomly crown one player as King, mark that player as first turn, and persist the started game.

## Scope

- Review saved players after setup.
- Start the game from the setup screen.
- Randomly select one King.
- Store the King as the current first-turn player.
- Persist the started game locally.
- Highlight the King on the dashboard.

## User Flow

1. Create a game and add players.
2. Review the saved player list.
3. Tap `Start game`.
4. Watch a short King selection animation.
5. Land on the game dashboard.
6. See the King and first-turn marker.

## Domain Behavior

- A game needs at least two players before it can start.
- A game cannot be started twice.
- King selection chooses one existing player.
- Starting sets `setupStatus` to `in-progress`.
- Starting sets `round` to `1`.
- Starting sets `kingPlayerId` and `currentTurnPlayerId` to the selected player.
- Starting records a `game.started` history entry.

## Data Shape

See [domain types](../lib/domain/types.ts) and [start game command](../lib/domain/game.ts).

## Acceptance Criteria

- Review players are visible after setup save.
- Start Game is disabled until setup is saved.
- Starting the game persists the selected King.
- Dashboard highlights the King.
- Unit tests cover selection and duplicate-start rejection.

## Test Notes

- Unit tests cover deterministic King selection with an injected random provider.
- End-to-end testing should verify the setup-to-dashboard path once the local toolchain is available.

## Related Docs

- [Sprint 3](../docs/Sprint3.md)
- [Player Flow](../docs/PlayerFlow.md)
- [Kingdom](../docs/Kingdom.md)
- [Game Creation](./game-creation.md)
