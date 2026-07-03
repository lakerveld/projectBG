# Decisions

## Purpose

Record architecture and product decisions so future contributors understand why the project is shaped this way.

## Goals

- Preserve context behind important choices.
- Avoid repeatedly reopening settled decisions without new evidence.
- Make future pivots explicit.
- Support production-quality technical planning.

## Decision Log

### DEC-001: Build Web MVP Before Native App

Status: Accepted

Decision: Build the MVP as a Next.js web application before investing in native packaging.

Why: The biggest current risk is product usefulness during real table play, not App Store distribution. A web MVP is faster to iterate, easier to share for playtests, and still leaves a path to a native wrapper.

Consequences: Native APIs such as haptics, background behavior, and app-store-specific persistence are deferred.

### DEC-002: No Accounts for MVP

Status: Accepted

Decision: Games are created locally and players do not log in.

Why: Account creation would add friction in a shared-table setting and increase privacy, backend, and support complexity before the core game loop is validated.

Consequences: Data recovery depends on local persistence and future export/import until cloud backup exists.

### DEC-003: Use Local-First Persistence

Status: Accepted

Decision: Store MVP games locally using IndexedDB behind a repository layer.

Why: The app must work without network access and persist after refresh. IndexedDB is better suited to structured records and larger histories than localStorage.

Consequences: Schema migrations must be planned early.

### DEC-004: Keep Domain Logic Outside React Components

Status: Accepted

Decision: Game rules, commands, validation, and event generation belong in `lib/domain`.

Why: Board-game companion logic is the core risk. Keeping it pure and testable reduces bugs and makes future cloud/native migration easier.

Consequences: Components should call commands or services rather than directly mutating complex game objects.

### DEC-005: Use Zustand for MVP Client State

Status: Accepted

Decision: Use Zustand for app-level state during implementation.

Why: Zustand is lightweight and well suited for local, interactive React state. It avoids large framework overhead while supporting selectors and persistence hooks.

Consequences: The team should define store boundaries carefully to avoid one giant global object.

### DEC-006: Use Original Theming and Terminology

Status: Accepted

Decision: The app may be Catan-inspired but should use original names, visuals, events, and resource language.

Why: The project should avoid depending on protected IP and should be able to become its own product identity.

Consequences: Design and game documents should avoid direct copyrighted presentation.

### DEC-007: Start Sprint 1 With Resource Tracking

Status: Superseded by DEC-015

Decision: Use resource adjustment as the first thin vertical slice.

Why: Resource adjustment exercises the most important MVP architecture boundaries without requiring full game setup, dice, events, trades, or conflict mechanics. It touches domain validation, history, local state, persistence, and mobile UI controls.

Consequences: Game setup remains a skeleton during the first pass, and the sample game acts as the temporary local state seed.

### DEC-008: Use Snapshot Plus History for MVP Persistence

Status: Accepted

Decision: Persist the current game snapshot while also recording meaningful history entries.

Why: Snapshots make resume fast and simple. History keeps table actions explainable and creates a path toward undo, audit, and future replay behavior.

Consequences: Commands must update both state and history consistently.

### DEC-009: Generate Local Game Metadata

Status: Accepted

Decision: Sprint 2 generates local game metadata instead of asking players to fill in game details.

Why: The setup screen should stay focused on the table: who is playing and which color each player uses. Game names, ruleset defaults, and storage metadata are implementation details until the app supports multiple saved games.

Consequences: The create-game form validates players only. The domain layer still supports an optional internal game name for future saved-game management.

### DEC-010: Combine Game Creation and Player Setup

Status: Accepted

Decision: The create-game screen also collects player names and colors. There is no separate player setup screen in the current build focus.

Why: The desired table flow is faster and clearer: click create game, fill in the game and players on one screen, save locally, then move to a dedicated review and random King selection step.

Consequences: Sprint 3 starts after the combined setup screen and focuses on a separate review, start game, and random King selection route rather than adding more controls to player setup.

### DEC-011: Random King Starts Round One

Status: Accepted

Decision: After players review and start the game, the app randomly selects one player as King and marks that player as the first-turn player for round 1.

Why: The updated MVP flow needs a table-visible ceremony that chooses the starting player and gives the app an immediate game-master role without replacing the physical dice or board.

Consequences: The game state stores `kingPlayerId`, `currentTurnPlayerId`, `round`, and `setupStatus`. Dice entry and turn rotation remain separate gameplay work.

### DEC-012: Hide Game Details During Setup

Status: Accepted

Decision: The second screen no longer asks for game name, ruleset preset, or table note. It only asks for players and colors.

Why: The table setup flow should be as direct as possible. Players care about who is playing before the first turn; internal game metadata can be generated or defaulted.

Consequences: The app generates a local game name and applies the default ruleset and curated color mode internally.

### DEC-013: Sprint 4 Uses Total-Only Dice Entry

Status: Accepted

Decision: Sprint 4 records physical dice as a single total from 2 to 12.

Why: Total-only entry is the fastest path to validating the first gameplay loop and keeps attention on the physical dice. Capturing individual die values can wait until probabilities or richer event rules need them.

Consequences: Resource production, momentum, and world-event handling are marked as deferred in dice history metadata.

### DEC-014: World Events Use Round Average

Status: Accepted

Decision: World events trigger after every player has rolled once. The round average determines whether the event is negative, neutral, or positive.

Why: This keeps events global and table-focused instead of targeting one player. It also gives dice entry a clear round-level payoff without requiring full resource automation.

Consequences: Game state tracks `currentRoundRolls` and `activeWorldEvent`. Individual event effects are recorded as deferred descriptions until resource, trade, and build systems exist.

### DEC-015: Simplify the MVP to Game Creation and Players First

Status: Accepted

Decision: The current MVP UI should focus on creating a game, adding players, starting the table, and showing the active players. Resource bookkeeping, history screens, settings, trades, attacks, defenses, and detailed corrections are deferred.

Why: The product needs to prove the shared-phone setup flow before adding systems that compete with physical board-game bookkeeping. A narrower loop is easier to test at the table and reduces the risk of building a heavy companion before the core ritual feels right.

Consequences: The home screen has one primary action, create game. The live dashboard shows player identity and turn state without resource controls or history panels. Existing domain/history structures may remain internally as scaffolding, but they should not drive visible MVP scope until intentionally reintroduced.

### DEC-016: Use One Major Table Step Per Screen

Status: Accepted

Decision: After player setup, major table steps move to their own screens. The current flow is home, player setup, King randomizer, then game dashboard.

Why: A shared-phone tabletop app must stay readable at arm's length and easy to hand around. Separating steps keeps each screen focused on one decision or ceremony and gives future mechanics a clear place in the flow instead of accumulating in one dashboard.

Consequences: Setup saves the players and routes to `/king`. The King randomizer reviews players, starts the game, and then routes to `/game`. Completed dice rounds route to `/event` so the world event owns the whole screen before players continue. Future trade or conflict steps should follow the same route-per-step pattern unless playtesting proves an inline control is faster.

## Open Questions

- Should app-generated dice be included in MVP or deferred?
- Should UI components be documented with a component explorer after the app shell stabilizes?

## Future Improvements

- Add a formal ADR template.
- Add decision IDs to related pull requests.
- Revisit proposed decisions after spikes.

## Related Documents

- [Architecture](./Architecture.md)
- [Database](./Database.md)
- [State Management](./StateManagement.md)
- [Tech Stack](./TechStack.md)
- [Roadmap](./Roadmap.md)
