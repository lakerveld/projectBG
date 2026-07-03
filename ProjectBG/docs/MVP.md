# MVP

## Purpose

Define the first releasable product slice: a local, single-device companion for Catan-inspired tabletop sessions.

## MVP Outcome

Players can start a local game, add players, crown the first player, enter dice rolls, and see lightweight world events that enhance the physical board game without replacing its tabletop bookkeeping.

## MVP Goals

- Support one shared phone at the table.
- Require no accounts, network, or login.
- Make game state recoverable after page refresh.
- Keep the on-screen flow focused enough for a shared phone on the table.
- Keep mechanics simple enough for playtesting.

## MVP Features

- Create a game from a single clear entry point.
- Add players with display names and colors.
- Review the player list before starting.
- Randomly select the King when the game starts.
- Enter dice rolls manually.
- Trigger random events from dice outcomes.
- Show a simple kingdom dashboard for every player.
- Persist active games locally.

## MVP Constraints

- Browser-first web app.
- Mobile-first layout.
- No authentication.
- No server database.
- No copyrighted Catan assets or official terminology.
- No full board representation unless later proven necessary.

## Current Build Focus

The immediate implementation focus follows the updated player flow:

- Sprint 2: create a local game, add players, fill in names, and pick colors on the same screen.
- Sprint 3: move to a dedicated King selection screen, review players, randomly crown the King, and mark the first turn.
- Sprint 4: begin round 1 by entering physical dice results.
- Sprint 5: trigger global world events from round-average dice results and reveal each event on its own screen.

Resource tracking, history screens, settings, trades, attacks, defenses, bonuses, penalties, and full event effect resolution remain future work until the create-game and player loop is stable.

## Acceptance Criteria

- A new group can start a game in under two minutes.
- The home screen presents one primary action: create game.
- Players can be added with names and unique colors.
- The dashboard shows players without requiring resource bookkeeping.
- Dice results can trigger deterministic or random event flows.
- A refresh does not lose the current game.
- The app is usable on a modern iPhone viewport.

## Open Questions

- Should dice rolls be entered manually only, or should the app include a roll button?
- When should resource tracking return, and should it be generic or themed for the initial ruleset?
- What is the first attack/defense mechanic that is interesting but not too complex?

## Future Improvements

- Custom ruleset editor.
- Resource tracking.
- Game history and corrections.
- Settings and ruleset controls.
- Multiple saved games.
- Export/import game logs.
- Optional cloud backup.
- Native app packaging.

## Related Documents

- [Vision](./Vision.md)
- [Mechanics](./Mechanics.md)
- [Dice System](./DiceSystem.md)
- [Resources](./Resources.md)
- [Kingdom](./Kingdom.md)
- [Events](./Events.md)
- [Player Flow](./PlayerFlow.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
