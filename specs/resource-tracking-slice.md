# Resource Tracking Slice

## Problem

Sprint 1 needs a thin vertical slice that proves the planned architecture without implementing full game mechanics. Resource adjustment is the smallest useful state transition because it touches domain rules, UI controls, history, state management, and persistence.

## Scope

- Display a sample local game.
- Show players and resource counts.
- Increment or decrement one resource at a time.
- Prevent negative balances.
- Record a history entry.
- Save the updated game through the repository boundary.

## User Flow

1. Open the game dashboard.
2. Find a player kingdom.
3. Tap plus or minus on a resource.
4. See the count update.
5. See the action appear in recent history.
6. Reload later and restore from local persistence when available.

## Domain Behavior

- Resource adjustments must be non-zero integers.
- Player ID must exist.
- Resource ID must exist.
- Resource quantities cannot go below zero.
- Every successful command emits one `resource.adjusted` history entry.

## Data Shape

See [domain types](../lib/domain/types.ts).

## Acceptance Criteria

- A resource can be incremented.
- A resource can be decremented when the player has enough quantity.
- A decrement below zero is rejected.
- Successful adjustments update `updatedAt`.
- Successful adjustments prepend a history entry.
- The dashboard calls the local persistence service after a successful change.

## Test Notes

- Unit tests cover increment and negative-balance rejection.
- Later tests should cover persistence migration and UI interaction.

## Related Docs

- [Sprint 1](../docs/Sprint1.md)
- [Architecture](../docs/Architecture.md)
- [Resources](../docs/Resources.md)
- [State Management](../docs/StateManagement.md)

