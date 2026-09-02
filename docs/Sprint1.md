# Sprint 1

## Purpose

Build the first map shell for the Antwerp journey.

## Goals

- Show the map and route state on a phone.
- Establish the first layout for locations and GPS status.
- Prove the app shell can support the journey flow.

## Proposed Scope

- Initialize the map-based route screen.
- Add the journey header and current location preview.
- Add GPS status and route progress UI.
- Define the first map-related domain types.
- Add basic tests for screen rendering and state shape.

## Out of Scope

- Dice resolution.
- Resource updates.
- Story beats.
- Multiplayer.
- Trade, attack, or defense.

## Definition of Done

- The app shows a route-focused shell.
- The current location and next location are visible.
- The map screen works on a phone viewport.
- The architecture assumptions are updated in [Decisions](./Decisions.md).

## Open Questions

- Should the map be the home screen or a route screen after a start screen?
- Should the first shell use a real map library or a simple static map view?
- Should route progress be shown as a list or as pinned points?

## Future Improvements

- Add a route explorer.
- Add more detailed map art.
- Continue with location activation in [Sprint 2](./Sprint2.md).

## Related Documents

- [Roadmap](./Roadmap.md)
- [Backlog](./Backlog.md)
- [Architecture](./Architecture.md)
- [Feature 1 Plan](./Feature1Plan.md)
