# State Management

## Purpose

Define how UI state, domain state, and persisted game state should be managed.

## Goals

- Keep game transitions predictable.
- Make domain rules testable outside React.
- Avoid prop drilling in shared screens.
- Support persistence and undo/history.

## Recommendation

Use Zustand for client state, with pure domain command handlers in `lib/domain`.

Why: Zustand is small and practical for a local-first interactive app. Pure command handlers keep the important rules framework-agnostic, which helps testing and future migration.

## State Categories

- Domain state: games, players, resources, events, effects, history.
- UI state: selected player, open modal, active flow step, filters.
- Persistence state: hydration status, migration status, save errors.

## Command Pattern

State-changing user actions should map to explicit commands:

- `createGame`
- `addPlayer`
- `recordDiceRoll`
- `applyWorldEvent`
- `applyEvent`
- `adjustResources`
- `settleTrade`
- `resolveAttack`
- `resolveDefense`
- `addCorrection`

Each command should validate input, return updated state, and emit one or more history entries.

## Open Questions

- Should undo be implemented as inverse commands or snapshot rollback?
- Should persistence happen after every command or through debounced saves?
- Should event generation be synchronous in MVP?
  - Yes for Sprint 5: world events are generated immediately when the round roll count reaches player count.

## Future Improvements

- State machine for multi-step flows.
- Optimistic sync with Supabase.
- Replayable event log.
- Developer debugging panel.

## Related Documents

- [Architecture](./Architecture.md)
- [Database](./Database.md)
- [Mechanics](./Mechanics.md)
- [Events](./Events.md)
