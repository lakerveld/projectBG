# MVP

## Purpose

Define the first releasable product slice: a local, single-device companion for Catan-inspired tabletop sessions.

## MVP Outcome

Players can start a local game, add players, track each player's kingdom state, enter dice rolls, resolve random events, apply bonuses and penalties, support trading, resolve simple attack/defense actions, and review game history.

## MVP Goals

- Support one shared phone at the table.
- Require no accounts, network, or login.
- Make game state recoverable after page refresh.
- Make every state-changing action visible in history.
- Allow correction through undo or compensating actions.
- Keep mechanics simple enough for playtesting.

## MVP Features

- Create game with name, player count, and optional ruleset settings.
- Add players with display names and colors.
- Track resources per player.
- Enter dice rolls manually.
- Trigger random events from dice outcomes.
- Apply bonuses and penalties.
- Show a kingdom dashboard for every player.
- Support basic trade proposal and settlement logging.
- Resolve attack and defense actions.
- Display chronological game history.
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
- Sprint 3: review players, start the game, randomly crown the King, and mark the first turn.
- Sprint 4: begin round 1 by entering physical dice results.
- Sprint 5: trigger global world events from round-average dice results.

Trades, attacks, defenses, bonuses, penalties, and full event effect resolution remain future work until the world-event loop is stable.

## Acceptance Criteria

- A new group can start a game in under two minutes.
- A player can update resources in three taps or fewer from the dashboard.
- Dice results can trigger deterministic or random event flows.
- A refresh does not lose the current game.
- The game history can explain why current state changed.
- The app is usable on a modern iPhone viewport.

## Open Questions

- Should dice rolls be entered manually only, or should the app include a roll button?
- Should resources be generic in the MVP or themed for the initial ruleset?
- What is the first attack/defense mechanic that is interesting but not too complex?

## Future Improvements

- Custom ruleset editor.
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
