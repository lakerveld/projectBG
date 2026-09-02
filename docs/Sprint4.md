# Sprint 4

## Purpose

Implement the resource ledger and local persistence for feature 1.

## Goals

- Show Matthew's current resources clearly.
- Save the active journey locally.
- Restore the journey after refresh.

## Scope

- Add the resource ledger view.
- Update resources after a resolved location.
- Persist the journey snapshot locally.
- Restore the active journey on reload.
- Add unit tests for resource updates and persistence.

## Out of Scope

- Story beats.
- Multiplayer.
- Trade, attack, or defense.
- Cloud sync.

## Definition of Done

- Matthew can see his current resources.
- Resource changes persist after refresh.
- The current journey resumes correctly.
- Tests cover resource updates and persistence.

## Open Questions

- Should the resource ledger be part of the map screen or a separate panel?
- Should history be visible by default or tucked behind a button?
- Should local saves be automatic after every change?

## Future Improvements

- Add correction flow.
- Add journey history filters.
- Continue with hardening in [Sprint 5](./Sprint5.md).

## Related Documents

- [Sprint 3](./Sprint3.md)
- [Sprint 5](./Sprint5.md)
- [Feature 1 Plan](./Feature1Plan.md)
