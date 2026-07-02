# Backlog

## Purpose

Maintain the initial product backlog with work grouped by Epic, Feature, Story, and Task. Complexity estimates use XS, S, M, L, and XL. Scope marks whether the item belongs to MVP or Future.

## Goals

- Give development a clear starting sequence.
- Keep MVP work separate from expansion ideas.
- Make complexity visible early.
- Support sprint planning without locking implementation details too soon.

## Backlog

| Type | Item | Description | Complexity | Scope |
| --- | --- | --- | --- | --- |
| Epic | Project Foundation | Repository, documentation, architecture, and standards. | M | MVP |
| Task | Create project structure | Add docs, design, prompts, app, components, lib, public, specs. | XS | MVP |
| Task | Create documentation corpus | Add planning and architecture docs with cross-links. | M | MVP |
| Task | Add README, license, gitignore | Establish basic repository identity and Git hygiene. | XS | MVP |
| Epic | App Foundation | Initialize Next.js app and baseline tooling. | L | MVP |
| Task | Initialize Next.js TypeScript app | Configure framework, routes, TailwindCSS, linting, and aliases. | M | MVP |
| Task | Add testing tools | Add Vitest and Playwright baseline. | M | MVP |
| Feature | App Shell | Mobile-first navigation and layout. | M | MVP |
| Story | Resume or create local game | As a group, we can start or resume a game quickly. | M | MVP |
| Epic | Game Setup | Create a local session and add players. | M | MVP |
| Feature | Create Game | Start a local game from player setup. | S | MVP |
| Story | Generate game metadata | As a group, we do not need to fill in game details before adding players. | XS | MVP |
| Story | Use default ruleset | As a group, we start with the default companion rules. | XS | MVP |
| Feature | Player Setup | Add players with names and colors. | M | MVP |
| Story | Add players on game creation screen | As a group, we can add players while creating the game. | S | MVP |
| Story | Pick player colors | As a group, we can assign each player a unique color during setup. | S | MVP |
| Epic | Setup Completion | Finish the create-game and player setup experience. | M | MVP |
| Feature | Setup Save Confirmation | Confirm a created game and players are saved locally. | S | MVP |
| Story | Save setup | As a group, we can save the game and players locally. | S | MVP |
| Story | Confirm saved setup | As a group, we can see that setup was saved. | XS | MVP |
| Feature | Review Players | Review the saved player list before starting. | S | MVP |
| Story | Confirm everyone joined | As a group, we can see all players before starting. | XS | MVP |
| Feature | Start Game | Start the saved local game. | M | MVP |
| Story | Random King selection | As a group, the app randomly selects the King. | S | MVP |
| Story | First turn marker | As players, we can see who takes the first turn. | S | MVP |
| Story | Highlight King's capital | As players, the dashboard clearly marks the King. | S | MVP |
| Task | Validate setup on mobile | Check create game and player setup on common phone widths. | S | MVP |
| Epic | Game Dashboard | Shared table view for current game state. | L | Future |
| Feature | Kingdom Dashboard | Show each player's resources, effects, and recent changes. | M | Future |
| Story | View player kingdoms | As players, we can compare current state at a glance. | M | Future |
| Story | Focus one kingdom | As the phone operator, I can update one player quickly. | S | Future |
| Feature | Resource Tracking | Adjust and validate player resources. | M | Future |
| Story | Increment and decrement resources | As players, we can keep counts accurate during play. | S | Future |
| Story | Prevent invalid balances | As players, we cannot accidentally create impossible resource states. | S | Future |
| Epic | Dice and Events | Enter dice rolls and resolve companion events. | L | MVP |
| Feature | Dice Entry | Manual dice result input. | S | MVP |
| Story | Enter dice result | As players, we can record each roll. | XS | MVP |
| Story | Validate dice result | As players, we get feedback for invalid totals. | XS | MVP |
| Feature | Event System | Trigger and apply structured world events. | L | MVP |
| Story | Track round rolls | As players, each player's roll is counted toward the round average. | S | MVP |
| Story | Generate event from round average | As players, the world mood changes after every player has rolled. | M | MVP |
| Story | Apply event history | As players, world events are visible in history and dashboard. | M | MVP |
| Story | Skip optional event | As players, optional events can be declined when allowed. | S | Future |
| Epic | Player Interaction | Trades, attacks, defenses, bonuses, and penalties. | XL | Future |
| Feature | Trade Support | Log and settle resource trades. | M | Future |
| Story | Create trade proposal | As players, we can describe offered and requested resources. | M | Future |
| Story | Settle accepted trade | As players, accepted trades update both kingdoms. | S | Future |
| Feature | Bonuses and Penalties | Track temporary and immediate effects. | M | Future |
| Story | Apply bonus | As players, positive effects can be added and consumed. | S | Future |
| Story | Apply penalty | As players, negative effects can be added and resolved. | S | Future |
| Feature | Attack and Defense | Resolve simple conflict actions. | L | Future |
| Story | Start attack | As a player, I can target another kingdom using a defined cost. | M | Future |
| Story | Resolve defense | As a target, I can use available defense effects. | M | Future |
| Epic | History and Recovery | Audit and correct game state. | L | Future |
| Feature | Game History | Chronological list of meaningful actions. | M | Future |
| Story | View game history | As players, we can see how state changed. | S | Future |
| Story | Filter history by player | As players, we can investigate disputes quickly. | S | Future |
| Feature | Correction Flow | Undo or record corrections. | M | MVP |
| Story | Undo last action | As players, we can recover from accidental input. | M | MVP |
| Story | Add correction note | As players, we can explain manual fixes. | S | Future |
| Epic | Persistence | Save and restore local games. | L | MVP |
| Feature | Local Storage | Persist games in IndexedDB. | M | MVP |
| Story | Resume active game | As players, refresh does not lose progress. | M | MVP |
| Story | Migrate local data | As developers, schema updates do not break saved games. | M | MVP |
| Feature | Export and Backup | Save game logs outside browser storage. | M | Future |
| Epic | Platform Expansion | Prepare for cloud and App Store. | XL | Future |
| Feature | Supabase Sync | Optional backup and sync. | XL | Future |
| Feature | Native Wrapper | Package for iOS App Store. | XL | Future |
| Feature | Player Accounts | Optional profiles and cloud ownership. | XL | Future |

## Open Questions

- Should attack/defense be included in the first playable slice or introduced after resource/dice validation? Answer: defer until after game creation and player setup are complete.
- Should export/import move into MVP because local browser storage can be fragile?
- Should event balancing be tracked as backlog tasks or playtest notes?

## Future Improvements

- Convert backlog into GitHub issues.
- Add priority and dependency fields.
- Add acceptance criteria per story.
- Add release milestone mapping.

## Related Documents

- [Roadmap](./Roadmap.md)
- [MVP](./MVP.md)
- [Sprint 0](./Sprint0.md)
- [Sprint 1](./Sprint1.md)
- [Sprint 2](./Sprint2.md)
- [Sprint 3](./Sprint3.md)
- [Sprint 4](./Sprint4.md)
- [Sprint 5](./Sprint5.md)
- [Mechanics](./Mechanics.md)
