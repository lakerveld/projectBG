# Game Creation

## Problem

Players need a fast way to create a local table session and add players without a multi-screen setup flow. The flow should prove the setup architecture without introducing gameplay systems.

## Scope

- Create a local game from `/setup`.
- Capture player names and player colors.
- Limit setup to four players.
- Offer the curated player colors white, orange, blue, and red.
- Generate the local game name internally.
- Default ruleset preset and color mode internally.
- Validate input before saving.
- Create a typed `GameState`.
- Save through the existing game service and IndexedDB repository boundary.
- Keep the user on the setup screen after successful creation and show a saved state.

## User Flow

1. Open the app.
2. Tap `Create local game`.
3. Add players.
4. Fill in player names and pick unique colors.
5. Submit the form.
6. Review the saved players.
7. Start the game.
8. Watch the app randomly select the King.
9. Continue to the dashboard with the King highlighted.

## Domain Behavior

- Game name defaults internally to `Table Session`.
- Ruleset preset defaults to `original-mvp`.
- Player color mode defaults to `curated`.
- At least two players are required.
- No more than four players are allowed.
- Player names are required.
- Player names must be unique.
- Player colors must be unique.
- Player colors come from the curated set: white, orange, blue, and red.
- The game starts with the submitted players.
- The game starts with setup status `ready`.
- A `game.created` history entry is added immediately.
- Starting the game selects exactly one King.
- The King becomes the first-turn player.
- Starting the game records a `game.started` history entry.

## Data Shape

See [domain types](../lib/domain/types.ts) and [create game command](../lib/domain/game.ts).

## Acceptance Criteria

- Empty names are rejected.
- Valid submission creates a local game.
- Created game has default resources and submitted players.
- Created game is persisted through `GameService`.
- Successful creation shows a saved confirmation.
- Starting the game persists `kingPlayerId`, `currentTurnPlayerId`, `round`, and `setupStatus`.
- Unit tests cover valid creation and invalid input.

## Test Notes

- Unit tests currently cover valid game creation, internal/supplied game name limits, minimum player count, and duplicate player names.
- End-to-end tests should be added after the setup screen stabilizes.

## Related Docs

- [Sprint 2](../docs/Sprint2.md)
- [Player Flow](../docs/PlayerFlow.md)
- [State Management](../docs/StateManagement.md)
