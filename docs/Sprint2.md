# Sprint 2

## Purpose

Implement the player setup screen as the first real user-facing setup feature.

## Goals

- Let a table group create a new local game by adding players immediately.
- Capture only the minimum useful player settings.
- Persist the created game with players locally and route to the next setup step.
- Keep the implementation aligned with the domain and storage boundaries from Sprint 1.

## Scope

- Replace the setup placeholder with a combined create-game and player form. Status: started.
- Add domain command for `createGame`. Status: started.
- Add validation for player names and colors. Status: started.
- Assign a random fantasy avatar to each player during setup. Status: started.
- Persist the created game through the existing game service/repository boundary. Status: started.
- Route the user to the King selection screen after a successful save. Status: started.
- Record a `game.created` history entry. Status: started.
- Add unit tests for game creation validation and state shape. Status: started.

## Recommended Fields

- Player names.
- Player colors.
- Random player avatar.

The game name, ruleset preset, and player color mode are generated or defaulted internally.

Avoid adding dice, event, trade, combat, or scoring configuration in this sprint.

## Out of Scope

- King selection and game start.
- Player accounts.
- Private player screens.
- Dice and events.
- Resource gameplay.
- Trading.
- Attack/defense mechanics.
- Multiple saved games management beyond overwriting or replacing the active draft.
- Supabase or accounts.

## Definition of Done

- A user can open the app and choose to create a new local game.
- The setup form validates player fields.
- Submitting creates a typed `GameState`.
- The created game includes players and is saved locally.
- Each player has a random avatar, framed by their selected color.
- The user advances to the King selection screen after creation.
- A `game.created` history entry exists.
- Unit tests cover the create-game command.

## Open Questions

- Should the app allow an unnamed game by generating a friendly default? Answer: yes, generate the local game name internally.
- Should creating a new game warn if another active game exists?
- Should ruleset preset be visible now or hidden until more than one preset exists? Answer: hidden for now.
- Should player setup happen on a separate screen? Answer: no, create game and player entry are one screen, then King selection is the next screen.

## Future Improvements

- Multiple saved games.
- Game templates.
- Import/export.
- Cloud backup.

## Related Documents

- [Sprint 1](./Sprint1.md)
- [Player Flow](./PlayerFlow.md)
- [State Management](./StateManagement.md)
- [Database](./Database.md)
- [Game Creation Spec](../specs/game-creation.md)
